import { UnoEngine } from '../game/UnoEngine.js';
import { BotPlayer } from '../game/BotPlayer.js';
import { GAME_STATUS } from '../utils/constants.js';

const BOT_NAMES = ['Lord Aiden', 'Duchess Vesper', 'Prince Leo', 'Lady Seraphina', 'Baron Klaus'];
const BOT_AVATARS = ['👑', '⚔️', '💎', '🛡️', '🦁'];

export class RoomManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map(); // roomId -> room data
    this.playerToRoom = new Map(); // socketId -> roomId
    this.quickMatchQueue = []; // array of { socketId, playerInfo }
  }

  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    do {
      code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (this.rooms.has(code));
    return code;
  }

  createRoom(hostPlayer, options = {}) {
    const roomId = options.customCode || this.generateRoomCode();
    const engine = new UnoEngine(roomId, { turnDuration: options.turnDuration || 15 });

    const room = {
      id: roomId,
      hostId: hostPlayer.id,
      engine,
      mode: options.mode || 'CLASSIC', // 'CLASSIC', 'QUICK_MATCH', 'FRIENDS', 'PRACTICE'
      arena: options.arena || 'ROYAL_PALACE',
      timer: null,
      botTurnTimeout: null,
      countdownTimer: null
    };

    engine.addPlayer({
      id: hostPlayer.id,
      name: hostPlayer.name || 'Player',
      avatar: hostPlayer.avatar || '👑',
      isBot: false
    });

    this.rooms.set(roomId, room);
    this.playerToRoom.set(hostPlayer.id, roomId);

    // If Practice mode, automatically add 3 bots
    if (options.mode === 'PRACTICE') {
      this.fillWithBots(roomId, 3);
    }

    return room;
  }

  joinRoom(roomId, player) {
    const room = this.rooms.get(roomId);
    if (!room) return { success: false, error: 'Room not found' };

    if (room.engine.status === GAME_STATUS.IN_PROGRESS) {
      return { success: false, error: 'Match already in progress' };
    }

    if (room.engine.players.length >= 4) {
      return { success: false, error: 'Room is full (max 4 players)' };
    }

    const added = room.engine.addPlayer({
      id: player.id,
      name: player.name || `Player ${room.engine.players.length + 1}`,
      avatar: player.avatar || '⚔️',
      isBot: false
    });

    if (!added) return { success: false, error: 'Failed to join room' };

    this.playerToRoom.set(player.id, roomId);
    return { success: true, room };
  }

  fillWithBots(roomId, targetCount = 3) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    let availableIndex = 0;
    while (room.engine.players.length < targetCount + 1 && room.engine.players.length < 4) {
      const botName = BOT_NAMES[availableIndex % BOT_NAMES.length];
      const botAvatar = BOT_AVATARS[availableIndex % BOT_AVATARS.length];
      const botId = `bot_${Date.now()}_${availableIndex}`;

      room.engine.addPlayer({
        id: botId,
        name: botName,
        avatar: botAvatar,
        isBot: true
      });
      availableIndex++;
    }
  }

  startCountdown(roomId, onComplete) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.engine.status = GAME_STATUS.COUNTDOWN;
    let count = 5;

    this.broadcastToRoom(roomId, 'COUNTDOWN_TICK', { count });

    room.countdownTimer = setInterval(() => {
      count--;
      if (count > 0) {
        this.broadcastToRoom(roomId, 'COUNTDOWN_TICK', { count });
      } else {
        clearInterval(room.countdownTimer);
        room.countdownTimer = null;
        this.startGame(roomId);
        if (onComplete) onComplete();
      }
    }, 1000);
  }

  startGame(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    // Fill remaining spots with bots if needed to ensure at least 2 players
    if (room.engine.players.length < 2) {
      this.fillWithBots(roomId, 1);
    }

    const started = room.engine.startGame();
    if (!started) return false;

    this.broadcastGameState(roomId);
    this.startTurnTimer(roomId);
    this.checkAndTriggerBotTurn(roomId);

    return true;
  }

  broadcastGameState(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.engine.players.forEach(player => {
      if (!player.isBot) {
        const state = room.engine.getSanitizedState(player.id);
        this.io.to(player.id).emit('GAME_STATE_UPDATE', state);
      }
    });
  }

  broadcastToRoom(roomId, event, data) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.engine.players.forEach(player => {
      if (!player.isBot) {
        this.io.to(player.id).emit(event, data);
      }
    });
  }

  startTurnTimer(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    if (room.timer) {
      clearTimeout(room.timer);
    }

    // Auto timeout after 15 seconds
    room.timer = setTimeout(() => {
      this.handleTurnTimeout(roomId);
    }, (room.engine.turnDuration + 1) * 1000);
  }

  handleTurnTimeout(roomId) {
    const room = this.rooms.get(roomId);
    if (!room || room.engine.status !== GAME_STATUS.IN_PROGRESS) return;

    const currentPlayer = room.engine.getCurrentPlayer();
    if (!currentPlayer) return;

    // Auto draw a card and pass turn
    room.engine.drawCard(currentPlayer.id);
    room.engine.passTurn(currentPlayer.id);

    this.broadcastToRoom(roomId, 'NOTIFICATION', {
      type: 'INFO',
      message: `${currentPlayer.name}'s turn timed out (Card auto-drawn)`
    });

    this.broadcastGameState(roomId);
    this.startTurnTimer(roomId);
    this.checkAndTriggerBotTurn(roomId);
  }

  checkAndTriggerBotTurn(roomId) {
    const room = this.rooms.get(roomId);
    if (!room || room.engine.status !== GAME_STATUS.IN_PROGRESS) return;

    const currentPlayer = room.engine.getCurrentPlayer();
    if (!currentPlayer || !currentPlayer.isBot) return;

    if (room.botTurnTimeout) {
      clearTimeout(room.botTurnTimeout);
    }

    // Random reaction delay between 1000ms and 1600ms
    const delay = Math.floor(Math.random() * 600) + 1000;

    room.botTurnTimeout = setTimeout(() => {
      this.executeBotTurn(roomId, currentPlayer);
    }, delay);
  }

  executeBotTurn(roomId, bot) {
    const room = this.rooms.get(roomId);
    if (!room || room.engine.status !== GAME_STATUS.IN_PROGRESS) return;

    const current = room.engine.getCurrentPlayer();
    if (!current || current.id !== bot.id) return;

    const botDecision = BotPlayer.chooseAction(room.engine, bot);

    if (botDecision.reaction) {
      this.broadcastToRoom(roomId, 'PLAYER_EMOTE', {
        playerId: bot.id,
        emote: botDecision.reaction.emote,
        phrase: botDecision.reaction.phrase
      });
    }

    if (botDecision.action === 'PLAY') {
      const result = room.engine.playCard(bot.id, botDecision.cardId, botDecision.chosenColor);
      
      // Bot calls UNO if needed
      if (botDecision.shouldCallUno) {
        setTimeout(() => {
          room.engine.callUno(bot.id);
          this.broadcastToRoom(roomId, 'UNO_SHOUT', {
            playerId: bot.id,
            playerName: bot.name
          });
          this.broadcastGameState(roomId);
        }, 300);
      }

      this.broadcastGameState(roomId);

      if (result.winner) {
        this.handleGameOver(roomId, result.winner);
        return;
      }

      this.startTurnTimer(roomId);
      this.checkAndTriggerBotTurn(roomId);
    } else {
      // Draw card
      const drawResult = room.engine.drawCard(bot.id);
      this.broadcastGameState(roomId);

      // If drawn card can be played, small chance to play it immediately
      if (drawResult.canPlay && Math.random() < 0.75) {
        setTimeout(() => {
          let chosenColor = null;
          if (drawResult.card.type === 'WILD' || drawResult.card.type === 'WILD_DRAW_FOUR') {
            chosenColor = BotPlayer.getBestColor(bot.hand);
          }
          const playRes = room.engine.playCard(bot.id, drawResult.card.id, chosenColor);
          this.broadcastGameState(roomId);

          if (playRes.winner) {
            this.handleGameOver(roomId, playRes.winner);
            return;
          }

          this.startTurnTimer(roomId);
          this.checkAndTriggerBotTurn(roomId);
        }, 700);
      } else {
        // Pass turn
        setTimeout(() => {
          room.engine.passTurn(bot.id);
          this.broadcastGameState(roomId);
          this.startTurnTimer(roomId);
          this.checkAndTriggerBotTurn(roomId);
        }, 600);
      }
    }
  }

  handleGameOver(roomId, winner) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    if (room.timer) clearTimeout(room.timer);
    if (room.botTurnTimeout) clearTimeout(room.botTurnTimeout);

    this.broadcastToRoom(roomId, 'MATCH_FINISHED', {
      winner: {
        id: winner.id,
        name: winner.name,
        avatar: winner.avatar
      },
      rewards: {
        coins: 150,
        xp: 250
      }
    });
  }

  removePlayer(playerId) {
    const roomId = this.playerToRoom.get(playerId);
    if (!roomId) return;

    const room = this.rooms.get(roomId);
    if (!room) return;

    this.playerToRoom.delete(playerId);

    if (room.engine.status === GAME_STATUS.IN_PROGRESS) {
      // Replace with bot to keep match active
      const player = room.engine.players.find(p => p.id === playerId);
      if (player) {
        player.isBot = true;
        player.name = `${player.name} (Bot)`;
        this.broadcastToRoom(roomId, 'NOTIFICATION', {
          type: 'INFO',
          message: `${player.name} disconnected. Replaced by a Royal Bot.`
        });
        this.checkAndTriggerBotTurn(roomId);
      }
    } else {
      room.engine.removePlayer(playerId);
      if (room.engine.players.length === 0) {
        this.cleanUpRoom(roomId);
      } else {
        if (room.hostId === playerId) {
          const nextHost = room.engine.players.find(p => !p.isBot);
          if (nextHost) room.hostId = nextHost.id;
        }
        this.broadcastGameState(roomId);
      }
    }
  }

  cleanUpRoom(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    if (room.timer) clearTimeout(room.timer);
    if (room.botTurnTimeout) clearTimeout(room.botTurnTimeout);
    if (room.countdownTimer) clearInterval(room.countdownTimer);
    this.rooms.delete(roomId);
  }
}
