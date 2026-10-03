import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { RoomManager } from './rooms/RoomManager.js';
import { GAME_STATUS } from './utils/constants.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    product: 'UNO ARENA',
    tagline: 'PLAY. MATCH. SHOUT UNO.',
    timestamp: new Date().toISOString(),
    activeRooms: roomManager.rooms.size
  });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const roomManager = new RoomManager(io);

io.on('connection', (socket) => {
  // 1. Create Room
  socket.on('CREATE_ROOM', (data, callback) => {
    try {
      const { player, mode, arena } = data || {};
      const room = roomManager.createRoom(
        {
          id: socket.id,
          name: player?.name || 'Player',
          avatar: player?.avatar || '👑'
        },
        { mode, arena }
      );

      socket.join(room.id);
      const state = room.engine.getSanitizedState(socket.id);
      if (typeof callback === 'function') {
        callback({ success: true, roomId: room.id, state });
      }
      roomManager.broadcastGameState(room.id);
    } catch (err) {
      console.error('CREATE_ROOM error:', err);
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  // 2. Join Room
  socket.on('JOIN_ROOM', (data, callback) => {
    try {
      const { roomId, player } = data || {};
      if (!roomId) {
        return callback?.({ success: false, error: 'Room code required' });
      }
      const upperRoomId = roomId.toUpperCase().trim();
      const result = roomManager.joinRoom(upperRoomId, {
        id: socket.id,
        name: player?.name || 'Player',
        avatar: player?.avatar || '⚔️'
      });

      if (!result.success) {
        return callback?.({ success: false, error: result.error });
      }

      socket.join(upperRoomId);
      const state = result.room.engine.getSanitizedState(socket.id);
      if (typeof callback === 'function') {
        callback({ success: true, roomId: upperRoomId, state });
      }
      roomManager.broadcastGameState(upperRoomId);
    } catch (err) {
      console.error('JOIN_ROOM error:', err);
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  // 3. Quick Match Queue
  socket.on('QUEUE_QUICK_MATCH', (data, callback) => {
    try {
      const { player } = data || {};
      // Find an open quick match room or create a new one
      let matchedRoom = null;
      for (const room of roomManager.rooms.values()) {
        if (room.mode === 'QUICK_MATCH' && room.engine.status === GAME_STATUS.LOBBY && room.engine.players.length < 4) {
          matchedRoom = room;
          break;
        }
      }

      if (matchedRoom) {
        roomManager.joinRoom(matchedRoom.id, {
          id: socket.id,
          name: player?.name || 'Challenger',
          avatar: player?.avatar || '🦁'
        });
        socket.join(matchedRoom.id);
        roomManager.broadcastGameState(matchedRoom.id);
        callback?.({ success: true, roomId: matchedRoom.id });
      } else {
        const newRoom = roomManager.createRoom(
          {
            id: socket.id,
            name: player?.name || 'Challenger',
            avatar: player?.avatar || '🦁'
          },
          { mode: 'QUICK_MATCH' }
        );
        socket.join(newRoom.id);
        callback?.({ success: true, roomId: newRoom.id });

        // After 3 seconds, fill with bots and start countdown if not already full
        setTimeout(() => {
          const currentRoom = roomManager.rooms.get(newRoom.id);
          if (currentRoom && currentRoom.engine.status === GAME_STATUS.LOBBY) {
            roomManager.fillWithBots(newRoom.id, 3);
            roomManager.startCountdown(newRoom.id);
          }
        }, 3500);
      }
    } catch (err) {
      console.error('QUEUE_QUICK_MATCH error:', err);
      callback?.({ success: false, error: err.message });
    }
  });

  // 4. Start Match / Countdown
  socket.on('START_MATCH', (data, callback) => {
    try {
      const roomId = roomManager.playerToRoom.get(socket.id);
      if (!roomId) return callback?.({ success: false, error: 'Not in a room' });

      const room = roomManager.rooms.get(roomId);
      if (!room || room.hostId !== socket.id) {
        return callback?.({ success: false, error: 'Only the host can start the match' });
      }

      roomManager.startCountdown(roomId, () => {
        // match launched
      });

      callback?.({ success: true });
    } catch (err) {
      console.error('START_MATCH error:', err);
      callback?.({ success: false, error: err.message });
    }
  });

  // 5. Play Card
  socket.on('PLAY_CARD', (data, callback) => {
    try {
      const { cardId, chosenColor } = data || {};
      const roomId = roomManager.playerToRoom.get(socket.id);
      if (!roomId) return callback?.({ success: false, error: 'Not in a room' });

      const room = roomManager.rooms.get(roomId);
      if (!room) return callback?.({ success: false, error: 'Room not found' });

      const result = room.engine.playCard(socket.id, cardId, chosenColor);
      if (!result.success) {
        return callback?.({ success: false, error: result.error });
      }

      callback?.({ success: true, specialEffects: result.specialEffects });
      roomManager.broadcastGameState(roomId);

      if (result.winner) {
        roomManager.handleGameOver(roomId, result.winner);
      } else {
        roomManager.startTurnTimer(roomId);
        roomManager.checkAndTriggerBotTurn(roomId);
      }
    } catch (err) {
      console.error('PLAY_CARD error:', err);
      callback?.({ success: false, error: err.message });
    }
  });

  // 6. Draw Card
  socket.on('DRAW_CARD', (data, callback) => {
    try {
      const roomId = roomManager.playerToRoom.get(socket.id);
      if (!roomId) return callback?.({ success: false, error: 'Not in a room' });

      const room = roomManager.rooms.get(roomId);
      if (!room) return callback?.({ success: false, error: 'Room not found' });

      const result = room.engine.drawCard(socket.id);
      if (!result.success) {
        return callback?.({ success: false, error: result.error });
      }

      callback?.({ success: true, card: result.card, canPlay: result.canPlay });
      roomManager.broadcastGameState(roomId);
    } catch (err) {
      console.error('DRAW_CARD error:', err);
      callback?.({ success: false, error: err.message });
    }
  });

  // 7. Pass Turn
  socket.on('PASS_TURN', (data, callback) => {
    try {
      const roomId = roomManager.playerToRoom.get(socket.id);
      if (!roomId) return callback?.({ success: false, error: 'Not in a room' });

      const room = roomManager.rooms.get(roomId);
      if (!room) return callback?.({ success: false, error: 'Room not found' });

      const result = room.engine.passTurn(socket.id);
      if (!result.success) {
        return callback?.({ success: false, error: result.error });
      }

      callback?.({ success: true });
      roomManager.broadcastGameState(roomId);
      roomManager.startTurnTimer(roomId);
      roomManager.checkAndTriggerBotTurn(roomId);
    } catch (err) {
      console.error('PASS_TURN error:', err);
      callback?.({ success: false, error: err.message });
    }
  });

  // 8. Call UNO
  socket.on('CALL_UNO', (data, callback) => {
    try {
      const roomId = roomManager.playerToRoom.get(socket.id);
      if (!roomId) return callback?.({ success: false, error: 'Not in a room' });

      const room = roomManager.rooms.get(roomId);
      if (!room) return callback?.({ success: false, error: 'Room not found' });

      const result = room.engine.callUno(socket.id);
      if (!result.success) {
        return callback?.({ success: false, error: result.error });
      }

      roomManager.broadcastToRoom(roomId, 'UNO_SHOUT', {
        playerId: socket.id,
        playerName: result.playerName
      });
      roomManager.broadcastGameState(roomId);
      callback?.({ success: true });
    } catch (err) {
      console.error('CALL_UNO error:', err);
      callback?.({ success: false, error: err.message });
    }
  });

  // 9. Catch UNO
  socket.on('CATCH_UNO', (data, callback) => {
    try {
      const { targetPlayerId } = data || {};
      const roomId = roomManager.playerToRoom.get(socket.id);
      if (!roomId) return callback?.({ success: false, error: 'Not in a room' });

      const room = roomManager.rooms.get(roomId);
      if (!room) return callback?.({ success: false, error: 'Room not found' });

      const result = room.engine.catchUno(socket.id, targetPlayerId);
      if (!result.success) {
        return callback?.({ success: false, error: result.error });
      }

      roomManager.broadcastToRoom(roomId, 'NOTIFICATION', {
        type: 'PENALTY',
        message: `UNO Caught! Opponent draws 2 penalty cards!`
      });
      roomManager.broadcastGameState(roomId);
      callback?.({ success: true });
    } catch (err) {
      console.error('CATCH_UNO error:', err);
      callback?.({ success: false, error: err.message });
    }
  });

  // 10. Reactions (Emotes & Quick Chat)
  socket.on('SEND_REACTION', (data) => {
    const { emote, phrase } = data || {};
    const roomId = roomManager.playerToRoom.get(socket.id);
    if (!roomId) return;

    roomManager.broadcastToRoom(roomId, 'PLAYER_EMOTE', {
      playerId: socket.id,
      emote,
      phrase
    });
  });

  // 11. Rematch
  socket.on('REMATCH', (data, callback) => {
    const roomId = roomManager.playerToRoom.get(socket.id);
    if (!roomId) return;

    const room = roomManager.rooms.get(roomId);
    if (!room) return;

    room.engine.startGame();
    roomManager.broadcastGameState(roomId);
    roomManager.startTurnTimer(roomId);
    roomManager.checkAndTriggerBotTurn(roomId);
    callback?.({ success: true });
  });

  // 12. Disconnect
  socket.on('disconnect', () => {
    roomManager.removePlayer(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🏰 UNO ARENA Server running on port ${PORT}`);
});
