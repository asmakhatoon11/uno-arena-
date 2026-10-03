import { COLORS, CARD_TYPES } from '../utils/constants.js';

export class BotPlayer {
  static getBestColor(hand) {
    const counts = {
      [COLORS.RED]: 0,
      [COLORS.BLUE]: 0,
      [COLORS.GREEN]: 0,
      [COLORS.YELLOW]: 0
    };

    hand.forEach(card => {
      if (counts[card.color] !== undefined) {
        counts[card.color]++;
      }
    });

    let bestColor = COLORS.RED;
    let maxCount = -1;

    for (const [color, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        bestColor = color;
      }
    }

    return bestColor;
  }

  static chooseAction(engine, bot) {
    // 1. Check if bot has 1 card and hasn't called UNO yet (90% chance to call)
    let shouldCallUno = false;
    if (bot.hand.length === 1 && !bot.hasCalledUno && Math.random() < 0.9) {
      shouldCallUno = true;
    }

    // 2. Find playable cards
    const playable = bot.hand.filter(card => engine.canPlayCard(card));

    if (playable.length === 0) {
      return {
        action: 'DRAW',
        shouldCallUno
      };
    }

    // Sort strategy:
    // 1st: Special colored action cards (DRAW_TWO, SKIP, REVERSE)
    // 2nd: Normal number cards
    // 3rd: Wild / Wild Draw Four (save for when needed)
    const actionCards = playable.filter(
      c => c.type === CARD_TYPES.DRAW_TWO || c.type === CARD_TYPES.SKIP || c.type === CARD_TYPES.REVERSE
    );
    const numberCards = playable.filter(c => c.type === CARD_TYPES.NUMBER);
    const wildCards = playable.filter(
      c => c.type === CARD_TYPES.WILD || c.type === CARD_TYPES.WILD_DRAW_FOUR
    );

    let chosenCard = null;
    if (actionCards.length > 0 && Math.random() < 0.7) {
      chosenCard = actionCards[Math.floor(Math.random() * actionCards.length)];
    } else if (numberCards.length > 0) {
      chosenCard = numberCards[Math.floor(Math.random() * numberCards.length)];
    } else if (actionCards.length > 0) {
      chosenCard = actionCards[Math.floor(Math.random() * actionCards.length)];
    } else if (wildCards.length > 0) {
      chosenCard = wildCards[Math.floor(Math.random() * wildCards.length)];
    } else {
      chosenCard = playable[0];
    }

    // If wild, choose best color
    let chosenColor = null;
    if (chosenCard.type === CARD_TYPES.WILD || chosenCard.type === CARD_TYPES.WILD_DRAW_FOUR) {
      chosenColor = this.getBestColor(bot.hand);
    }

    // Random reaction chance
    let reaction = null;
    if (chosenCard.type === CARD_TYPES.WILD_DRAW_FOUR || chosenCard.type === CARD_TYPES.DRAW_TWO) {
      if (Math.random() < 0.45) {
        const attackEmotes = ['😈', '🔥', '😎', '👑'];
        const attackPhrases = ['Oops!', 'Take that!', 'Let\'s go!'];
        reaction = {
          emote: attackEmotes[Math.floor(Math.random() * attackEmotes.length)],
          phrase: attackPhrases[Math.floor(Math.random() * attackPhrases.length)]
        };
      }
    }

    return {
      action: 'PLAY',
      cardId: chosenCard.id,
      card: chosenCard,
      chosenColor,
      shouldCallUno,
      reaction
    };
  }

  static getRandomBotReaction(type = 'GENERAL') {
    const emotes = ['😂', '😎', '🔥', '😱', '👏', '😈', '🤯', '❤️'];
    const phrases = ['Nice move!', 'Good game!', 'Oops!', 'Wow!', 'Let\'s go!'];
    return {
      emote: emotes[Math.floor(Math.random() * emotes.length)],
      phrase: phrases[Math.floor(Math.random() * phrases.length)]
    };
  }
}
