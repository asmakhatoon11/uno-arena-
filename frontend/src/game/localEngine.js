import { COLORS, CARD_TYPES } from '../utils/constants.js';

export class LocalDeck {
  constructor() {
    this.cards = [];
    this.reset();
  }

  reset() {
    this.cards = [];
    const colors = [COLORS.RED, COLORS.BLUE, COLORS.GREEN, COLORS.YELLOW];
    let idCounter = 1;

    colors.forEach(color => {
      this.cards.push({ id: `lc_${idCounter++}`, color, type: CARD_TYPES.NUMBER, value: 0 });
      for (let num = 1; num <= 9; num++) {
        for (let i = 0; i < 2; i++) {
          this.cards.push({ id: `lc_${idCounter++}`, color, type: CARD_TYPES.NUMBER, value: num });
        }
      }
      for (let i = 0; i < 2; i++) {
        this.cards.push({ id: `lc_${idCounter++}`, color, type: CARD_TYPES.SKIP, value: 'SKIP' });
        this.cards.push({ id: `lc_${idCounter++}`, color, type: CARD_TYPES.REVERSE, value: 'REVERSE' });
        this.cards.push({ id: `lc_${idCounter++}`, color, type: CARD_TYPES.DRAW_TWO, value: '+2' });
      }
    });

    for (let i = 0; i < 4; i++) {
      this.cards.push({ id: `lc_${idCounter++}`, color: COLORS.WILD, type: CARD_TYPES.WILD, value: 'WILD' });
      this.cards.push({ id: `lc_${idCounter++}`, color: COLORS.WILD, type: CARD_TYPES.WILD_DRAW_FOUR, value: '+4' });
    }

    this.shuffle();
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw() {
    return this.cards.pop() || null;
  }

  drawMultiple(count) {
    const list = [];
    for (let i = 0; i < count; i++) {
      const c = this.draw();
      if (c) list.push(c);
    }
    return list;
  }

  recycle(discardPile) {
    if (discardPile.length <= 1) return;
    const top = discardPile[discardPile.length - 1];
    const recycled = discardPile.slice(0, discardPile.length - 1);
    recycled.forEach(c => {
      if (c.type === CARD_TYPES.WILD || c.type === CARD_TYPES.WILD_DRAW_FOUR) {
        c.color = COLORS.WILD;
      }
    });
    this.cards = recycled;
    this.shuffle();
    discardPile.length = 0;
    discardPile.push(top);
  }
}

export class LocalGameEngine {
  constructor(humanPlayer, botCount = 3) {
    this.deck = new LocalDeck();
    this.discardPile = [];
    this.players = [];
    this.currentTurnIndex = 0;
    this.direction = 1;
    this.currentColor = null;
    this.topCard = null;
    this.winner = null;
    this.isOver = false;
    this.hasDrawnThisTurn = false;

    // Add human player
    this.players.push({
      id: humanPlayer.id,
      name: humanPlayer.name,
      avatar: humanPlayer.avatar,
      isBot: false,
      hand: [],
      hasCalledUno: false
    });

    // Add bots
    const botPool = [
      { name: 'Duchess Vesper', avatar: '⚔️' },
      { name: 'Lord Aiden', avatar: '🦁' },
      { name: 'Archmage Zephyr', avatar: '💎' }
    ];

    for (let i = 0; i < botCount; i++) {
      const bot = botPool[i % botPool.length];
      this.players.push({
        id: `local_bot_${i + 1}`,
        name: bot.name,
        avatar: bot.avatar,
        isBot: true,
        hand: [],
        hasCalledUno: false
      });
    }

    this.initMatch();
  }

  initMatch() {
    this.deck.reset();
    this.discardPile = [];
    this.direction = 1;
    this.winner = null;
    this.isOver = false;
    this.hasDrawnThisTurn = false;

    // Deal 7 to each
    this.players.forEach(p => {
      p.hand = this.deck.drawMultiple(7);
      p.hasCalledUno = false;
    });

    // First card (non-wild)
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
  }

  getCurrentPlayer() {
    return this.players[this.currentTurnIndex];
  }

  canPlayCard(card) {
    if (!this.topCard || !card) return false;
    if (card.type === CARD_TYPES.WILD || card.type === CARD_TYPES.WILD_DRAW_FOUR) return true;
    if (card.color === this.currentColor) return true;
    if (card.type === CARD_TYPES.NUMBER && this.topCard.type === CARD_TYPES.NUMBER && card.value === this.topCard.value) return true;
    if (card.type === this.topCard.type && card.type !== CARD_TYPES.NUMBER) return true;
    return false;
  }

  ensureDeck(count = 1) {
    if (this.deck.cards.length < count) {
      this.deck.recycle(this.discardPile);
    }
  }

  playCard(playerId, cardId, chosenColor = null) {
    const player = this.getCurrentPlayer();
    if (!player || player.id !== playerId) return { success: false, error: 'Not your turn' };

    const cIdx = player.hand.findIndex(c => c.id === cardId);
    if (cIdx === -1) return { success: false, error: 'Card not in hand' };

    const card = player.hand[cIdx];
    if (!this.canPlayCard(card)) return { success: false, error: 'Card cannot be played' };

    const isWild = card.type === CARD_TYPES.WILD || card.type === CARD_TYPES.WILD_DRAW_FOUR;
    if (isWild && (!chosenColor || chosenColor === COLORS.WILD)) {
      return { success: false, error: 'Must choose a valid color' };
    }

    player.hand.splice(cIdx, 1);
    this.discardPile.push(card);
    this.topCard = card;
    this.currentColor = isWild ? chosenColor : card.color;
    this.hasDrawnThisTurn = false;

    if (player.hand.length > 1) {
      player.hasCalledUno = false;
    }

    const effects = {
      cardPlayed: card,
      chosenColor: isWild ? chosenColor : null,
      playerId: player.id,
      playerName: player.name,
      skippedPlayerId: null,
      drawnCardsCount: 0,
      drawnCardsPlayerId: null,
      directionReversed: false
    };

    if (player.hand.length === 0) {
      this.isOver = true;
      this.winner = player;
      return { success: true, winner: player, effects };
    }

    let advanceStep = 1;
    if (card.type === CARD_TYPES.SKIP) {
      advanceStep = 2;
      effects.skippedPlayerId = this.players[this.getNextIndex(1)].id;
    } else if (card.type === CARD_TYPES.REVERSE) {
      if (this.players.length === 2) {
        advanceStep = 2;
        effects.skippedPlayerId = this.players[this.getNextIndex(1)].id;
      } else {
        this.direction *= -1;
        effects.directionReversed = true;
        advanceStep = 1;
      }
    } else if (card.type === CARD_TYPES.DRAW_TWO) {
      const target = this.players[this.getNextIndex(1)];
      this.ensureDeck(2);
      target.hand.push(...this.deck.drawMultiple(2));
      effects.drawnCardsCount = 2;
      effects.drawnCardsPlayerId = target.id;
      effects.skippedPlayerId = target.id;
      advanceStep = 2;
    } else if (card.type === CARD_TYPES.WILD_DRAW_FOUR) {
      const target = this.players[this.getNextIndex(1)];
      this.ensureDeck(4);
      target.hand.push(...this.deck.drawMultiple(4));
      effects.drawnCardsCount = 4;
      effects.drawnCardsPlayerId = target.id;
      effects.skippedPlayerId = target.id;
      advanceStep = 2;
    }

    this.advanceTurn(advanceStep);
    return { success: true, effects };
  }

  drawCard(playerId) {
    const player = this.getCurrentPlayer();
    if (!player || player.id !== playerId) return { success: false, error: 'Not your turn' };
    if (this.hasDrawnThisTurn) return { success: false, error: 'Already drawn' };

    this.ensureDeck(1);
    const card = this.deck.draw();
    if (!card) return { success: false, error: 'Deck empty' };

    player.hand.push(card);
    this.hasDrawnThisTurn = true;
    return { success: true, card, canPlay: this.canPlayCard(card) };
  }

  passTurn(playerId) {
    const player = this.getCurrentPlayer();
    if (!player || player.id !== playerId) return { success: false, error: 'Not your turn' };
    this.advanceTurn(1);
    return { success: true };
  }

  callUno(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return false;
    if (player.hand.length === 1) {
      player.hasCalledUno = true;
      return true;
    }
    return false;
  }

  catchUno(targetId) {
    const target = this.players.find(p => p.id === targetId);
    if (!target) return false;
    if (target.hand.length === 1 && !target.hasCalledUno) {
      this.ensureDeck(2);
      target.hand.push(...this.deck.drawMultiple(2));
      return true;
    }
    return false;
  }

  getNextIndex(step = 1) {
    const len = this.players.length;
    let idx = (this.currentTurnIndex + (step * this.direction)) % len;
    if (idx < 0) idx += len;
    return idx;
  }

  advanceTurn(step = 1) {
    this.currentTurnIndex = this.getNextIndex(step);
    this.hasDrawnThisTurn = false;
  }

  getState(forPlayerId) {
    return {
      status: this.isOver ? 'FINISHED' : 'IN_PROGRESS',
      direction: this.direction,
      currentColor: this.currentColor,
      topCard: this.topCard,
      deckRemaining: this.deck.cards.length,
      discardCount: this.discardPile.length,
      currentTurnPlayerId: this.getCurrentPlayer()?.id,
      winner: this.winner ? { id: this.winner.id, name: this.winner.name } : null,
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        isBot: p.isBot,
        cardCount: p.hand.length,
        hasCalledUno: p.hasCalledUno,
        // Only return card objects if it's the requesting player
        hand: p.id === forPlayerId ? [...p.hand] : []
      }))
    };
  }
}
