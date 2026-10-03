import { UnoEngine } from './game/UnoEngine.js';
import { Deck } from './game/Deck.js';
import { BotPlayer } from './game/BotPlayer.js';
import { COLORS, CARD_TYPES, GAME_STATUS } from './utils/constants.js';

console.log('🧪 Starting UNO ARENA Engine Verification Test Suite...\n');

let testsPassed = 0;
let testsTotal = 0;

function assert(condition, message) {
  testsTotal++;
  if (condition) {
    testsPassed++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Deck Generation Test
console.log('--- 1. Deck Generation & Card Count ---');
const deck = new Deck();
assert(deck.cards.length === 108, `Deck has 108 cards (Actual: ${deck.cards.length})`);

const redCards = deck.cards.filter(c => c.color === COLORS.RED);
assert(redCards.length === 25, `Red color has 25 cards (Actual: ${redCards.length})`);

const wildCards = deck.cards.filter(c => c.type === CARD_TYPES.WILD);
assert(wildCards.length === 4, `There are 4 standard Wild cards (Actual: ${wildCards.length})`);

const wildFourCards = deck.cards.filter(c => c.type === CARD_TYPES.WILD_DRAW_FOUR);
assert(wildFourCards.length === 4, `There are 4 Wild Draw Four cards (Actual: ${wildFourCards.length})`);

// 2. Engine Game Initialization Test
console.log('\n--- 2. Engine Game Initialization ---');
const engine = new UnoEngine('TEST_ROOM');
engine.addPlayer({ id: 'p1', name: 'Queen Victoria', avatar: '👑' });
engine.addPlayer({ id: 'p2', name: 'Knight Arthur', avatar: '⚔️' });
engine.addPlayer({ id: 'p3', name: 'Lord Aiden', avatar: '🦁', isBot: true });

assert(engine.players.length === 3, 'Added 3 players (1 host, 1 peer, 1 bot)');
const started = engine.startGame();
assert(started === true, 'Engine successfully started match');
assert(engine.status === GAME_STATUS.IN_PROGRESS, 'Game status is IN_PROGRESS');
assert(engine.players[0].hand.length === 7, 'Player 1 dealt 7 cards');
assert(engine.players[1].hand.length === 7, 'Player 2 dealt 7 cards');
assert(engine.players[2].hand.length === 7, 'Player 3 dealt 7 cards');
assert(engine.topCard !== null, 'Initial top card established');
assert(engine.currentColor !== null, 'Initial active color set');

// 3. Card Matching Rules
console.log('\n--- 3. Card Validation Logic ---');
engine.currentColor = COLORS.RED;
engine.topCard = { id: 'c_test', color: COLORS.RED, type: CARD_TYPES.NUMBER, value: 5 };

const matchColor = { id: 'c1', color: COLORS.RED, type: CARD_TYPES.NUMBER, value: 9 };
const matchValue = { id: 'c2', color: COLORS.BLUE, type: CARD_TYPES.NUMBER, value: 5 };
const noMatch = { id: 'c3', color: COLORS.GREEN, type: CARD_TYPES.NUMBER, value: 3 };
const wildCard = { id: 'c4', color: COLORS.WILD, type: CARD_TYPES.WILD, value: 'WILD' };

assert(engine.canPlayCard(matchColor) === true, 'Same color card is playable');
assert(engine.canPlayCard(matchValue) === true, 'Same value number card of different color is playable');
assert(engine.canPlayCard(noMatch) === false, 'Mismatched color & value card is NOT playable');
assert(engine.canPlayCard(wildCard) === true, 'Wild card is always playable');

// 4. Action Cards (Skip, Reverse, Draw Two, Wild +4)
console.log('\n--- 4. Special Cards Mechanics ---');
// Skip test:
const curPlayer = engine.getCurrentPlayer();
curPlayer.hand.push({ id: 'action_skip', color: COLORS.RED, type: CARD_TYPES.SKIP, value: 'SKIP' });
const skipRes = engine.playCard(curPlayer.id, 'action_skip');
assert(skipRes.success === true, 'Successfully played Skip card');
assert(skipRes.specialEffects.skippedPlayerId !== null, 'Next player skipped');

// Draw Two test:
engine.currentColor = COLORS.BLUE;
engine.topCard = { id: 'c_top', color: COLORS.BLUE, type: CARD_TYPES.NUMBER, value: 1 };
const activeP = engine.getCurrentPlayer();
const nextPlayerIdx = engine.getNextPlayerIndex(1);
const nextPlayerBeforeHand = engine.players[nextPlayerIdx].hand.length;
activeP.hand.push({ id: 'action_d2', color: COLORS.BLUE, type: CARD_TYPES.DRAW_TWO, value: '+2' });
const d2Res = engine.playCard(activeP.id, 'action_d2');
assert(d2Res.success === true, 'Successfully played Draw Two card');
assert(engine.players[nextPlayerIdx].hand.length === nextPlayerBeforeHand + 2, 'Target player drew 2 penalty cards');

// 5. UNO Call and Catch Logic
console.log('\n--- 5. UNO Shout & Catch Mechanics ---');
const testUnoP = engine.getCurrentPlayer();
testUnoP.hand = [{ id: 'last_card', color: COLORS.RED, type: CARD_TYPES.NUMBER, value: 7 }];
testUnoP.hasCalledUno = false;

assert(testUnoP.hand.length === 1, 'Player down to 1 card');
const callRes = engine.callUno(testUnoP.id);
assert(callRes.success === true, 'Player can call UNO with 1 card');
assert(testUnoP.hasCalledUno === true, 'hasCalledUno flag set to true');

// Catch opponent failing to call UNO
const opponentP = engine.players[(engine.currentTurnIndex + 1) % engine.players.length];
opponentP.hand = [{ id: 'opp_single', color: COLORS.BLUE, type: CARD_TYPES.NUMBER, value: 2 }];
opponentP.hasCalledUno = false;
const catchRes = engine.catchUno(testUnoP.id, opponentP.id);
assert(catchRes.success === true, 'Successfully caught opponent with 1 uncalled card');
assert(opponentP.hand.length === 3, 'Caught opponent penalized with +2 cards (Total: 3)');

// 6. Bot Intelligence Test
console.log('\n--- 6. Bot Player AI ---');
const botInstance = engine.players.find(p => p.isBot);
botInstance.hand = [
  { id: 'b1', color: COLORS.GREEN, type: CARD_TYPES.NUMBER, value: 9 },
  { id: 'b2', color: COLORS.GREEN, type: CARD_TYPES.SKIP, value: 'SKIP' },
  { id: 'b3', color: COLORS.WILD, type: CARD_TYPES.WILD, value: 'WILD' }
];
const bestColor = BotPlayer.getBestColor(botInstance.hand);
assert(bestColor === COLORS.GREEN, `Bot calculates best color correctly (Expected GREEN, got ${bestColor})`);

engine.currentColor = COLORS.GREEN;
engine.topCard = { id: 'top_g', color: COLORS.GREEN, type: CARD_TYPES.NUMBER, value: 3 };
const botAction = BotPlayer.chooseAction(engine, botInstance);
assert(botAction.action === 'PLAY', 'Bot identified valid cards and chose to PLAY');
assert(botAction.cardId !== null, `Bot selected card: ${botAction.cardId}`);

// 7. Sanitized State Security
console.log('\n--- 7. State Sanitization ---');
const stateForP1 = engine.getSanitizedState('p1');
assert(stateForP1.players[0].hand.length > 0, 'Own player sees their cards');
assert(stateForP1.players[1].hand.length === 0, 'Peer hand card details are hidden (only cardCount exposed)');

console.log(`\n========================================`);
console.log(`Test Results: ${testsPassed} / ${testsTotal} Passed!`);
console.log(`========================================\n`);

if (testsPassed === testsTotal) {
  process.exit(0);
} else {
  process.exit(1);
}
