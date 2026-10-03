import { COLORS, CARD_TYPES, GAME_STATUS, TURN_TIMEOUT_SECONDS } from '../utils/constants.js';
import { Deck } from './Deck.js';

export class UnoEngine {
  constructor(roomId, options = {}) {
    this.roomId = roomId;
    this.deck = new Deck();
    this.discardPile = [];
    this.players = [];
    this.currentTurnIndex = 0;
    this.direction = 1; // 1 = clockwise, -1 = counter-clockwise
    this.currentColor = null;
    this.topCard = null;
    this.status = GAME_STATUS.LOBBY;
    this.winner = null;
    this.lastAction = null;
    this.turnStartTime = Date.now();
    this.turnDuration = options.turnDuration || TURN_TIMEOUT_SECONDS;
    this.hasDrawnThisTurn = false;
  }

  addPlayer(player) {
    if (this.players.length >= 4) return false;
    this.players.push({
      id: player.id,
      name: player.name || `Player ${this.players.length + 1}`,
      avatar: player.avatar || '👑',
      isBot: Boolean(player.isBot),
      hand: [],
      hasCalledUno: false,
      ready: Boolean(player.isBot),
      score: 0
    });
    return true;
  }

  removePlayer(playerId) {
    const index = this.players.findIndex(p => p.id === playerId);
    if (index === -1) return false;
    this.players.splice(index, 1);
    if (this.currentTurnIndex >= this.players.length) {
      this.currentTurnIndex = 0;
    }
    return true;
  }

  startGame() {
    if (this.players.length < 2) return false;
    this.status = GAME_STATUS.IN_PROGRESS;
    this.deck.reset();
    this.discardPile = [];
    this.direction = 1;
    this.winner = null;
    this.hasDrawnThisTurn = false;

    // Deal 7 cards to each player
    this.players.forEach(player => {
      player.hand = this.deck.drawMultiple(7);
      player.hasCalledUno = false;
    });

    // Draw first card for discard pile (must not be a Wild / Wild Draw 4 to keep game start clear)
    let firstCard = this.deck.draw();
    while (firstCard && (firstCard.type === CARD_TYPES.WILD || firstCard.type === CARD_TYPES.WILD_DRAW_FOUR)) {
      this.deck.cards.unshift(firstCard);
      this.deck.shuffle();
      firstCard = this.deck.draw();
    }

    this.topCard = firstCard;
    this.currentColor = firstCard.color;
    this.discardPile.push(firstCard);

    this.currentTurnIndex = 0;
    this.turnStartTime = Date.now();
    this.lastAction = {
      type: 'GAME_STARTED',
      message: 'The match has begun!'
    };

    return true;
  }

  getCurrentPlayer() {
    return this.players[this.currentTurnIndex] || null;
  }

  canPlayCard(card) {
    if (!this.topCard || !card) return false;
    if (card.type === CARD_TYPES.WILD || card.type === CARD_TYPES.WILD_DRAW_FOUR) {
      return true;
    }
    if (card.color === this.currentColor) {
      return true;
    }
    if (card.type === CARD_TYPES.NUMBER && this.topCard.type === CARD_TYPES.NUMBER && card.value === this.topCard.value) {
      return true;
    }
    if (card.type === this.topCard.type && card.type !== CARD_TYPES.NUMBER) {
      return true;
    }
    return false;
  }

  ensureDeckHasCards(count = 1) {
    if (this.deck.remaining < count) {
      this.deck.recycleDiscard(this.discardPile);
    }
  }

  playCard(playerId, cardId, chosenColor = null) {
    if (this.status !== GAME_STATUS.IN_PROGRESS) {
      return { success: false, error: 'Game is not in progress' };
    }

    const currentPlayer = this.getCurrentPlayer();
    if (!currentPlayer || currentPlayer.id !== playerId) {
      return { success: false, error: 'Not your turn' };
    }

    const cardIndex = currentPlayer.hand.findIndex(c => c.id === cardId);
    if (cardIndex === -1) {
      return { success: false, error: 'Card not in hand' };
    }

    const card = currentPlayer.hand[cardIndex];
    if (!this.canPlayCard(card)) {
      return { success: false, error: 'Card cannot be played' };
    }

    // If wild, chosen color is required
    const isWild = card.type === CARD_TYPES.WILD || card.type === CARD_TYPES.WILD_DRAW_FOUR;
    if (isWild && (!chosenColor || chosenColor === COLORS.WILD)) {
      return { success: false, error: 'Must choose a valid color for Wild card' };
    }

    // Remove from hand and add to discard
    currentPlayer.hand.splice(cardIndex, 1);
    this.discardPile.push(card);
    this.topCard = card;
    this.currentColor = isWild ? chosenColor : card.color;
    this.hasDrawnThisTurn = false;

    // Reset UNO call if player now has > 1 card
    if (currentPlayer.hand.length > 1) {
      currentPlayer.hasCalledUno = false;
    }

    const specialEffects = {
      cardPlayed: card,
      chosenColor: isWild ? chosenColor : null,
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      skippedPlayerId: null,
      drawnCardsCount: 0,
      drawnCardsPlayerId: null,
      directionReversed: false
    };

    // Check Win
    if (currentPlayer.hand.length === 0) {
      this.status = GAME_STATUS.FINISHED;
      this.winner = currentPlayer;
      this.lastAction = {
        type: 'GAME_OVER',
        message: `${currentPlayer.name} wins the Arena!`,
        winner: currentPlayer
      };
      return { success: true, winner: currentPlayer, specialEffects };
    }

    // Process card action logic
    let advanceStep = 1;

    if (card.type === CARD_TYPES.SKIP) {
      advanceStep = 2;
      const skippedIndex = this.getNextPlayerIndex(1);
      specialEffects.skippedPlayerId = this.players[skippedIndex].id;
    } else if (card.type === CARD_TYPES.REVERSE) {
      if (this.players.length === 2) {
        advanceStep = 2; // 2 players: reverse acts like skip
        const skippedIndex = this.getNextPlayerIndex(1);
        specialEffects.skippedPlayerId = this.players[skippedIndex].id;
      } else {
        this.direction *= -1;
        specialEffects.directionReversed = true;
        advanceStep = 1;
      }
    } else if (card.type === CARD_TYPES.DRAW_TWO) {
      const targetIndex = this.getNextPlayerIndex(1);
      const targetPlayer = this.players[targetIndex];
      this.ensureDeckHasCards(2);
      const drawn = this.deck.drawMultiple(2);
      targetPlayer.hand.push(...drawn);
      specialEffects.drawnCardsCount = 2;
      specialEffects.drawnCardsPlayerId = targetPlayer.id;
      specialEffects.skippedPlayerId = targetPlayer.id;
      advanceStep = 2; // Target player draws and loses their turn
    } else if (card.type === CARD_TYPES.WILD_DRAW_FOUR) {
      const targetIndex = this.getNextPlayerIndex(1);
      const targetPlayer = this.players[targetIndex];
      this.ensureDeckHasCards(4);
      const drawn = this.deck.drawMultiple(4);
      targetPlayer.hand.push(...drawn);
      specialEffects.drawnCardsCount = 4;
      specialEffects.drawnCardsPlayerId = targetPlayer.id;
      specialEffects.skippedPlayerId = targetPlayer.id;
      advanceStep = 2; // Target player draws and loses their turn
    }

    this.advanceTurn(advanceStep);
    this.lastAction = {
      type: 'CARD_PLAYED',
      card,
      playerId: currentPlayer.id,
      specialEffects
    };

    return { success: true, specialEffects };
  }

  drawCard(playerId) {
    if (this.status !== GAME_STATUS.IN_PROGRESS) {
      return { success: false, error: 'Game not in progress' };
    }

    const currentPlayer = this.getCurrentPlayer();
    if (!currentPlayer || currentPlayer.id !== playerId) {
      return { success: false, error: 'Not your turn' };
    }

    if (this.hasDrawnThisTurn) {
      return { success: false, error: 'Already drawn this turn' };
    }

    this.ensureDeckHasCards(1);
    const drawn = this.deck.draw();
    if (!drawn) {
      return { success: false, error: 'No cards available to draw' };
    }

    currentPlayer.hand.push(drawn);
    this.hasDrawnThisTurn = true;

    // Check if drawn card is playable
    const canPlayDrawn = this.canPlayCard(drawn);

    this.lastAction = {
      type: 'CARD_DRAWN',
      playerId: currentPlayer.id,
      cardCount: 1
    };

    return {
      success: true,
      card: drawn,
      canPlay: canPlayDrawn
    };
  }

  passTurn(playerId) {
    const currentPlayer = this.getCurrentPlayer();
    if (!currentPlayer || currentPlayer.id !== playerId) {
      return { success: false, error: 'Not your turn' };
    }

    this.hasDrawnThisTurn = false;
    this.advanceTurn(1);
    this.lastAction = {
      type: 'TURN_PASSED',
      playerId: currentPlayer.id
    };
    return { success: true };
  }

  callUno(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return { success: false, error: 'Player not found' };

    // Valid if player has 1 card
    if (player.hand.length === 1) {
      player.hasCalledUno = true;
      this.lastAction = {
        type: 'UNO_CALLED',
        playerId: player.id,
        playerName: player.name
      };
      return { success: true, playerId: player.id, playerName: player.name };
    }

    return { success: false, error: 'Cannot call UNO with multiple cards' };
  }

  catchUno(callerId, targetPlayerId) {
    const targetPlayer = this.players.find(p => p.id === targetPlayerId);
    if (!targetPlayer) return { success: false, error: 'Target not found' };

    // Penalty applies if target has exactly 1 card and has NOT called UNO
    if (targetPlayer.hand.length === 1 && !targetPlayer.hasCalledUno) {
      this.ensureDeckHasCards(2);
      const penaltyCards = this.deck.drawMultiple(2);
      targetPlayer.hand.push(...penaltyCards);
      
      this.lastAction = {
        type: 'UNO_CAUGHT',
        callerId,
        targetPlayerId,
        message: `${targetPlayer.name} forgot to shout UNO and draws 2 penalty cards!`
      };
      return { success: true, caughtPlayerId: targetPlayer.id, penaltyCount: 2 };
    }

    return { success: false, error: 'Target already called UNO or does not have 1 card' };
  }

  getNextPlayerIndex(step = 1) {
    const numPlayers = this.players.length;
    let nextIndex = (this.currentTurnIndex + (step * this.direction)) % numPlayers;
    if (nextIndex < 0) nextIndex += numPlayers;
    return nextIndex;
  }

  advanceTurn(step = 1) {
    this.currentTurnIndex = this.getNextPlayerIndex(step);
    this.turnStartTime = Date.now();
    this.hasDrawnThisTurn = false;
  }

  getSanitizedState(forPlayerId) {
    return {
      roomId: this.roomId,
      status: this.status,
      direction: this.direction,
      currentColor: this.currentColor,
      topCard: this.topCard,
      deckRemaining: this.deck.remaining,
      discardCount: this.discardPile.length,
      currentTurnPlayerId: this.getCurrentPlayer()?.id,
      turnStartTime: this.turnStartTime,
      turnDuration: this.turnDuration,
      winner: this.winner ? { id: this.winner.id, name: this.winner.name } : null,
      lastAction: this.lastAction,
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        isBot: p.isBot,
        cardCount: p.hand.length,
        hasCalledUno: p.hasCalledUno,
        ready: p.ready,
        // Only return card details if this is the requesting player's hand
        hand: p.id === forPlayerId ? p.hand : []
      }))
    };
  }
}
