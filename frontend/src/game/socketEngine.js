```javascript
import { io } from 'socket.io-client';

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  'https://uno-arena-backend-2026.onrender.com';

export class SocketGameEngine {
  constructor(player, options = {}) {
    this.player = player;
    this.roomId = null;
    this.socket = null;
    this.state = null;
    this.players = [];

    this.hasDrawnThisTurn = false;
    this.previousTurnPlayerId = null;

    this.listeners = new Set();
    this.connected = false;

    this.lastReaction = null;
    this.lastUno = null;

    this.connect();

    if (options.autoCreate !== false) {
      this.createRoom(
        options.mode || 'QUICK_MATCH',
        options.arena || 'ROYAL_PALACE'
      );
    }
  }

  connect() {
    this.socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true
    });

    this.socket.on('connect', () => {
      this.connected = true;
      this.notify();
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      this.notify();
    });

    this.socket.on('GAME_STATE_UPDATE', (state) => {
      this.applyState(state);
    });

    this.socket.on('MATCH_FINISHED', (data) => {
      if (!this.state) return;

      this.state = {
        ...this.state,
        status: 'FINISHED',
        winner: data?.winner || null
      };

      this.syncPlayers();
      this.notify();
    });

    this.socket.on('PLAYER_EMOTE', (data) => {
      this.lastReaction = {
        ...data,
        timestamp: Date.now()
      };

      this.notify();
    });

    this.socket.on('UNO_SHOUT', (data) => {
      this.lastUno = {
        ...data,
        timestamp: Date.now()
      };

      this.notify();
    });
  }

  applyState(state) {
    if (!state) return;

    const nextTurnPlayerId = state.currentTurnPlayerId;

    /*
     * IMPORTANT:
     * Do not reset hasDrawnThisTurn every time the server sends
     * a GAME_STATE_UPDATE.
     *
     * Drawing a card causes the server to send another state update.
     * If we reset here, the UI forgets that the player already drew.
     */
    if (
      this.previousTurnPlayerId !== null &&
      this.previousTurnPlayerId !== nextTurnPlayerId
    ) {
      this.hasDrawnThisTurn = false;
    }

    this.previousTurnPlayerId = nextTurnPlayerId;

    this.state = state;
    this.roomId = state.roomId || this.roomId;

    this.syncPlayers();
    this.notify();
  }

  syncPlayers() {
    if (!this.state?.players) {
      this.players = [];
      return;
    }

    this.players = this.state.players.map(player => ({
      ...player,
      hand: Array.isArray(player.hand)
        ? player.hand
        : []
    }));
  }

  notify() {
    this.listeners.forEach(listener => {
      try {
        listener(this.getState(this.player.id));
      } catch (error) {
        console.error('SocketGameEngine listener error:', error);
      }
    });
  }

  subscribe(listener) {
    this.listeners.add(listener);

    if (this.state) {
      listener(this.getState(this.player.id));
    }

    return () => {
      this.listeners.delete(listener);
    };
  }

  createRoom(
    mode = 'QUICK_MATCH',
    arena = 'ROYAL_PALACE'
  ) {
    if (!this.socket) return;

    /*
     * QUICK_MATCH must go through the server matchmaking queue.
     *
     * The old code created a room first and then queued the same
     * socket again. That could cause the player to be added twice
     * or matched incorrectly.
     */
    if (mode === 'QUICK_MATCH') {
      this.queueQuickMatch();
      return;
    }

    this.socket.emit(
      'CREATE_ROOM',
      {
        player: this.player,
        mode,
        arena
      },
      (result) => {
        if (!result?.success) {
          console.error(
            'CREATE_ROOM failed:',
            result?.error
          );
          return;
        }

        this.roomId = result.roomId;

        if (result.state) {
          this.applyState(result.state);
        }
      }
    );
  }

  joinRoom(roomId) {
    if (!this.socket || !roomId) return;

    const cleanRoomId = String(roomId)
      .trim()
      .toUpperCase();

    this.socket.emit(
      'JOIN_ROOM',
      {
        roomId: cleanRoomId,
        player: this.player
      },
      (result) => {
        if (!result?.success) {
          console.error(
            'JOIN_ROOM failed:',
            result?.error
          );
          return;
        }

        this.roomId = result.roomId;

        if (result.state) {
          this.applyState(result.state);
        }
      }
    );
  }

  queueQuickMatch() {
    if (!this.socket) return;

    this.socket.emit(
      'QUEUE_QUICK_MATCH',
      {
        player: this.player
      },
      (result) => {
        if (!result?.success) {
          console.error(
            'QUEUE_QUICK_MATCH failed:',
            result?.error
          );
          return;
        }

        this.roomId =
          result.roomId || this.roomId;
      }
    );
  }

  startMatch() {
    if (!this.socket) {
      return {
        success: false,
        error: 'Not connected'
      };
    }

    this.socket.emit(
      'START_MATCH',
      {},
      (result) => {
        if (!result?.success) {
          console.error(
            'START_MATCH failed:',
            result?.error
          );
        }
      }
    );

    return {
      success: true,
      pending: true
    };
  }

  playCard(
    playerId,
    cardId,
    chosenColor = null
  ) {
    if (!this.socket) {
      return {
        success: false,
        error: 'Not connected'
      };
    }

    if (playerId !== this.player.id) {
      return {
        success: false,
        error: 'Invalid player'
      };
    }

    this.socket.emit(
      'PLAY_CARD',
      {
        cardId,
        chosenColor
      },
      (result) => {
        if (!result?.success) {
          console.error(
            'PLAY_CARD failed:',
            result?.error
          );
        }
      }
    );

    return {
      success: true,
      pending: true
    };
  }

  drawCard(playerId) {
    if (!this.socket) {
      return {
        success: false,
        error: 'Not connected'
      };
    }

    if (playerId !== this.player.id) {
      return {
        success: false,
        error: 'Invalid player'
      };
    }

    this.hasDrawnThisTurn = true;

    this.socket.emit(
      'DRAW_CARD',
      {},
      (result) => {
        if (!result?.success) {
          this.hasDrawnThisTurn = false;

          console.error(
            'DRAW_CARD failed:',
            result?.error
          );

          return;
        }

        this.hasDrawnThisTurn = true;
      }
    );

    return {
      success: true,
      pending: true,
      canPlay: false
    };
  }

  passTurn(playerId) {
    if (!this.socket) {
      return {
        success: false,
        error: 'Not connected'
      };
    }

    if (playerId !== this.player.id) {
      return {
        success: false,
        error: 'Invalid player'
      };
    }

    this.hasDrawnThisTurn = false;

    this.socket.emit(
      'PASS_TURN',
      {},
      (result) => {
        if (!result?.success) {
          console.error(
            'PASS_TURN failed:',
            result?.error
          );
        }
      }
    );

    return {
      success: true,
      pending: true
    };
  }

  callUno(playerId) {
    if (
      !this.socket ||
      playerId !== this.player.id
    ) {
      return false;
    }

    this.socket.emit(
      'CALL_UNO',
      {},
      (result) => {
        if (!result?.success) {
          console.error(
            'CALL_UNO failed:',
            result?.error
          );
        }
      }
    );

    return true;
  }

  catchUno(targetPlayerId) {
    if (!this.socket) {
      return false;
    }

    this.socket.emit(
      'CATCH_UNO',
      {
        targetPlayerId
      },
      (result) => {
        if (!result?.success) {
          console.error(
            'CATCH_UNO failed:',
            result?.error
          );
        }
      }
    );

    return true;
  }

  sendReaction(
    emote,
    phrase = null
  ) {
    if (!this.socket) return;

    this.socket.emit(
      'SEND_REACTION',
      {
        emote,
        phrase
      }
    );
  }

  rematch() {
    if (!this.socket) {
      return {
        success: false,
        error: 'Not connected'
      };
    }

    this.socket.emit(
      'REMATCH',
      {},
      (result) => {
        if (!result?.success) {
          console.error(
            'REMATCH failed:',
            result?.error
          );
        }
      }
    );

    return {
      success: true,
      pending: true
    };
  }

  canPlayCard(card) {
    if (
      !this.state?.topCard ||
      !card
    ) {
      return false;
    }

    if (
      card.type === 'WILD' ||
      card.type === 'WILD_DRAW_FOUR'
    ) {
      return true;
    }

    if (
      card.color ===
      this.state.currentColor
    ) {
      return true;
    }

    if (
      card.type === 'NUMBER' &&
      this.state.topCard.type === 'NUMBER' &&
      card.value ===
        this.state.topCard.value
    ) {
      return true;
    }

    if (
      card.type === this.state.topCard.type &&
      card.type !== 'NUMBER'
    ) {
      return true;
    }

    return false;
  }

  getCurrentPlayer() {
    return (
      this.players.find(
        player =>
          player.id ===
          this.state?.currentTurnPlayerId
      ) || null
    );
  }

  getState(
    forPlayerId = this.player.id
  ) {
    if (!this.state) {
      return {
        roomId: this.roomId,
        status: 'LOBBY',
        direction: 1,
        currentColor: null,
        topCard: null,
        deckRemaining: 0,
        discardCount: 0,
        currentTurnPlayerId: null,
        turnStartTime: Date.now(),
        turnDuration: 15,
        winner: null,
        lastAction: null,
        players: [],
        connected: this.connected,
        hasDrawnThisTurn:
          this.hasDrawnThisTurn,
        lastReaction: this.lastReaction,
        lastUno: this.lastUno
      };
    }

    return {
      ...this.state,

      connected: this.connected,

      hasDrawnThisTurn:
        this.hasDrawnThisTurn,

      lastReaction:
        this.lastReaction,

      lastUno:
        this.lastUno,

      players:
        this.state.players.map(
          player => ({
            ...player,
            hand:
              player.id === forPlayerId
                ? [
                    ...(player.hand || [])
                  ]
                : []
          })
        )
    };
  }

  destroy() {
    this.listeners.clear();

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.connected = false;
  }
}
```
