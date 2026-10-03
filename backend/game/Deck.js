import { COLORS, CARD_TYPES } from '../utils/constants.js';

export class Deck {
  constructor() {
    this.cards = [];
    this.reset();
  }

  reset() {
    this.cards = [];
    const colors = [COLORS.RED, COLORS.BLUE, COLORS.GREEN, COLORS.YELLOW];
    let idCounter = 1;

    colors.forEach(color => {
      // One '0' per color
      this.cards.push({
        id: `c_${idCounter++}`,
        color,
        type: CARD_TYPES.NUMBER,
        value: 0
      });

      // Two of each 1-9
      for (let num = 1; num <= 9; num++) {
        for (let i = 0; i < 2; i++) {
          this.cards.push({
            id: `c_${idCounter++}`,
            color,
            type: CARD_TYPES.NUMBER,
            value: num
          });
        }
      }

      // Two Skip, Reverse, Draw Two per color
      for (let i = 0; i < 2; i++) {
        this.cards.push({
          id: `c_${idCounter++}`,
          color,
          type: CARD_TYPES.SKIP,
          value: 'SKIP'
        });
        this.cards.push({
          id: `c_${idCounter++}`,
          color,
          type: CARD_TYPES.REVERSE,
          value: 'REVERSE'
        });
        this.cards.push({
          id: `c_${idCounter++}`,
          color,
          type: CARD_TYPES.DRAW_TWO,
          value: '+2'
        });
      }
    });

    // 4 Wild cards
    for (let i = 0; i < 4; i++) {
      this.cards.push({
        id: `c_${idCounter++}`,
        color: COLORS.WILD,
        type: CARD_TYPES.WILD,
        value: 'WILD'
      });
    }

    // 4 Wild Draw Four cards
    for (let i = 0; i < 4; i++) {
      this.cards.push({
        id: `c_${idCounter++}`,
        color: COLORS.WILD,
        type: CARD_TYPES.WILD_DRAW_FOUR,
        value: '+4'
      });
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
    const drawn = [];
    for (let i = 0; i < count; i++) {
      const card = this.draw();
      if (card) drawn.push(card);
    }
    return drawn;
  }

  recycleDiscard(discardPile) {
    // Keep top card, shuffle the rest back into deck
    if (discardPile.length <= 1) return;
    const topCard = discardPile[discardPile.length - 1];
    const recycled = discardPile.slice(0, discardPile.length - 1);
    
    // Reset any chosen wild color on recycled cards
    recycled.forEach(card => {
      if (card.type === CARD_TYPES.WILD || card.type === CARD_TYPES.WILD_DRAW_FOUR) {
        card.color = COLORS.WILD;
      }
    });

    this.cards = recycled;
    this.shuffle();
    discardPile.length = 0;
    discardPile.push(topCard);
  }

  get remaining() {
    return this.cards.length;
  }
}
