import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft } from 'lucide-react';
import GameTable from '../components/GameTable';
import GameCard from '../components/GameCard';
import GamePlayerSeat from '../components/GamePlayerSeat';
import EnvironmentLayer from '../components/EnvironmentLayer';
import ColorPickerModal from '../components/ColorPickerModal';
import CardHand from '../components/CardHand';
import { audioService } from '../services/audioService';
import { CARD_TYPES, COLORS } from '../utils/constants';

const TUTORIAL_STEPS = [
  {
    step: 1,
    mentorSpeech: "Welcome, Sovereign! In UNO ARENA, be the first to play all your cards. Tap 'LET'S GO' to begin!",
    buttonText: "LET'S GO ⚔️"
  },
  {
    step: 2,
    mentorSpeech: "Match the color! Tap your glowing RED 5 to match the Red 2 on the table.",
    targetCardId: 'tut_red5'
  },
  {
    step: 3,
    mentorSpeech: "Great move! Now match the number: The table card is Red 5. Match it with your BLUE 5!",
    targetCardId: 'tut_blue5'
  },
  {
    step: 4,
    mentorSpeech: "Need a card? When you cannot match, tap the DRAW DECK to draw from the pile!",
    actionType: 'DRAW'
  },
  {
    step: 5,
    mentorSpeech: "Block your rival! Play your Blue SKIP card to cancel Duchess Vesper's turn!",
    targetCardId: 'tut_blue_skip'
  },
  {
    step: 6,
    mentorSpeech: "Invert destiny! Play your Blue REVERSE to spin direction around the arena!",
    targetCardId: 'tut_blue_rev'
  },
  {
    step: 7,
    mentorSpeech: "Royal attack! Play your Blue DRAW TWO (+2) to force Vesper to draw 2 cards!",
    targetCardId: 'tut_blue_d2'
  },
  {
    step: 8,
    mentorSpeech: "Shift the arena colors! Play your WILD card and choose GREEN!",
    targetCardId: 'tut_wild'
  },
  {
    step: 9,
    mentorSpeech: "Ultimate weapon! Play WILD DRAW FOUR (+4) to strike with four penalty cards!",
    targetCardId: 'tut_wd4'
  },
  {
    step: 10,
    mentorSpeech: "Down to one! Play your Green 8 so you only have 1 card left in hand.",
    targetCardId: 'tut_green8'
  },
  {
    step: 11,
    mentorSpeech: "CRITICAL: Don't forget! When holding 1 card, SHOUT UNO before you are caught! Tap UNO!",
    actionType: 'UNO_BUTTON'
  },
  {
    step: 12,
    mentorSpeech: "Final coronation! Play your final Green 3 and claim the Arena Crown!",
    targetCardId: 'tut_green3'
  }
];

export default function InteractiveTutorialPage({ onExit, onComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [flyingCard, setFlyingCard] = useState(null);
  const [opponentEmotion, setOpponentEmotion] = useState('normal');

  const [hand, setHand] = useState([
    { id: 'tut_red5', color: COLORS.RED, type: CARD_TYPES.NUMBER, value: 5 },
    { id: 'tut_blue5', color: COLORS.BLUE, type: CARD_TYPES.NUMBER, value: 5 },
    { id: 'tut_blue_skip', color: COLORS.BLUE, type: CARD_TYPES.SKIP, value: 'SKIP' },
    { id: 'tut_blue_rev', color: COLORS.BLUE, type: CARD_TYPES.REVERSE, value: 'REVERSE' },
    { id: 'tut_blue_d2', color: COLORS.BLUE, type: CARD_TYPES.DRAW_TWO, value: '+2' },
    { id: 'tut_wild', color: COLORS.WILD, type: CARD_TYPES.WILD, value: 'WILD' },
    { id: 'tut_wd4', color: COLORS.WILD, type: CARD_TYPES.WILD_DRAW_FOUR, value: '+4' },
    { id: 'tut_green8', color: COLORS.GREEN, type: CARD_TYPES.NUMBER, value: 8 },
    { id: 'tut_green3', color: COLORS.GREEN, type: CARD_TYPES.NUMBER, value: 3 }
  ]);

  const [topCard, setTopCard] = useState({
    id: 'top_start',
    color: COLORS.RED,
    type: CARD_TYPES.NUMBER,
    value: 2
  });
  const [currentColor, setCurrentColor] = useState(COLORS.RED);

  const currentStep = TUTORIAL_STEPS[currentStepIndex];

  const handleNextButtonClick = () => {
    audioService.playButtonClick();
    setCurrentStepIndex(1);
  };

  const handleCardClick = (card) => {
    if (currentStep.targetCardId && card.id === currentStep.targetCardId) {
      if (card.type === CARD_TYPES.WILD || card.type === CARD_TYPES.WILD_DRAW_FOUR) {
        setShowColorPicker(true);
        return;
      }

      audioService.playWhoosh();
      setFlyingCard(card);

      setTimeout(() => {
        setFlyingCard(null);
        audioService.playCard();

        setHand(prev => prev.filter(c => c.id !== card.id));
        setTopCard(card);
        setCurrentColor(card.color);

        // Opponent reaction
        setOpponentEmotion('shocked');
        setTimeout(() => setOpponentEmotion('normal'), 1200);

        advanceStep(card.type);
      }, 350);
    } else {
      audioService.playButtonClick();
    }
  };

  const handleColorSelected = (chosenColor) => {
    setShowColorPicker(false);
    const card = hand.find(c => c.id === currentStep.targetCardId);
    if (card) {
      audioService.playWhoosh();
      setFlyingCard(card);

      setTimeout(() => {
        setFlyingCard(null);
        audioService.playCard();
        setHand(prev => prev.filter(c => c.id !== card.id));
        setTopCard({ ...card, color: chosenColor });
        setCurrentColor(chosenColor);
        advanceStep(card.type);
      }, 350);
    }
  };

  const handleDrawClick = () => {
    if (currentStep.actionType === 'DRAW') {
      audioService.playDrawCard();
      setHand(prev => [
        ...prev,
        { id: 'drawn_yellow1', color: COLORS.YELLOW, type: CARD_TYPES.NUMBER, value: 1 }
      ]);
      advanceStep('DRAW');
    }
  };

  const handleUnoClick = () => {
    if (currentStep.actionType === 'UNO_BUTTON') {
      audioService.playUnoSuccess();
      advanceStep('UNO');
    }
  };

  const advanceStep = () => {
    if (currentStepIndex === TUTORIAL_STEPS.length - 1) {
      audioService.playVictory();
      try {
        confetti({ particleCount: 160, spread: 90 });
      } catch {}
      setTimeout(() => {
        onComplete({ coins: 350, xp: 500 });
      }, 1800);
      return;
    }

    setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
    }, 600);
  };

  const opponentBot = {
    id: 'tut_bot',
    name: 'Duchess Vesper',
    avatar: '⚔️',
    cardCount: 5
  };

  return (
    <div className="tutorial-page-root">
      <EnvironmentLayer arenaId="ROYAL_PALACE" />

      {/* Header */}
      <div className="game-top-hud">
        <button className="game-btn-circle" onClick={onExit}>
          <ArrowLeft size={20} />
        </button>
        <span style={{ fontFamily: 'var(--font-title)', fontSize: '1rem', fontWeight: 900, color: '#FFF1A8' }}>
          ACADEMY STEP {currentStep.step} / 12
        </span>
        <div style={{ width: '44px' }} />
      </div>

      {/* Interactive In-Game Mentor Bubble Overlay */}
      <div className="tutorial-mentor-card">
        <div className="mentor-avatar-box">🦁</div>
        <div className="mentor-speech-content">
          <div className="mentor-name-title">MENTOR LEO</div>
          <div className="mentor-speech-text">{currentStep.mentorSpeech}</div>
          {currentStep.buttonText && (
            <button
              className="game-btn-green"
              style={{ marginTop: '8px', padding: '6px 18px', fontSize: '0.85rem' }}
              onClick={handleNextButtonClick}
            >
              {currentStep.buttonText}
            </button>
          )}
        </div>
      </div>

      {/* Real In-Game Table */}
      <div className="game-table-stage" style={{ paddingTop: '10px' }}>
        {/* Opponent Seat */}
        <GamePlayerSeat
          player={opponentBot}
          position="top"
          emotion={opponentEmotion}
        />

        <GameTable
          topCard={topCard}
          currentColor={currentColor}
          deckRemaining={40}
          direction={1}
          onDrawCard={handleDrawClick}
          isMyTurn={true}
        />
      </div>

      {/* Bottom Player Hand */}
      <div className="bottom-player-section">
        {currentStep.actionType === 'UNO_BUTTON' && (
          <div style={{ marginBottom: '8px' }}>
            <button
              className="game-btn-play"
              style={{ padding: '8px 32px', fontSize: '1.15rem' }}
              onClick={handleUnoClick}
            >
              👑 SHOUT UNO!
            </button>
          </div>
        )}

        <CardHand
          cards={hand}
          playableCardIds={new Set(currentStep.targetCardId ? [currentStep.targetCardId] : [])}
          isMyTurn={true}
          onPlayCard={handleCardClick}
        />
      </div>

      {/* Flying card animation */}
      {flyingCard && (
        <div
          className="card-flight-projectile"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(1.05)' }}
        >
          <GameCard card={flyingCard} size="lg" />
        </div>
      )}

      {showColorPicker && (
        <ColorPickerModal onSelectColor={handleColorSelected} />
      )}
    </div>
  );
}
