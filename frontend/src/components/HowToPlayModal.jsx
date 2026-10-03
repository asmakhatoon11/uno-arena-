import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Volume2, Music, Zap, Shield, RotateCcw } from 'lucide-react';
import { audioService } from '../services/audioService';

const TUTORIAL_STEPS = [
  {
    step: 1,
    tag: 'BASICS',
    title: 'Welcome to UNO ARENA',
    highlight: 'Match your card with the top card by COLOR or NUMBER.',
    description: 'Be the first player to empty your hand to win the match. When it is your turn, pick a card that matches the active color or the active number on the discard pile.',
    icon: '👑',
    visualType: 'match'
  },
  {
    step: 2,
    tag: 'ATTACK & STRATEGY',
    title: 'Special Cards',
    highlight: 'Use action cards to outsmart your opponents!',
    items: [
      { badge: '🚫 SKIP', text: 'Skips the next player\'s turn.' },
      { badge: '+2 DRAW TWO', text: 'Forces the next player to draw 2 cards!' },
      { badge: '🌈 WILD', text: 'Lets you choose the next active color.' },
      { badge: '+4 WILD DRAW FOUR', text: 'Changes the color & forces next player to draw 4!' }
    ],
    icon: '⚡',
    visualType: 'special'
  },
  {
    step: 3,
    tag: 'CRITICAL RULE',
    title: 'SHOUT UNO!',
    highlight: 'When you have ONE card left, press the UNO button!',
    description: 'If you forget to press UNO before your turn finishes, opponents can catch you with 🚨 CATCH UNO and force a +2 card penalty on you!',
    icon: '🚨',
    visualType: 'uno'
  },
  {
    step: 4,
    tag: 'GAMEPLAY FLOW',
    title: 'Your Turn',
    highlight: 'Play a valid card or draw from the deck.',
    description: 'When it is your turn, your cards light up with glowing chevrons. If you don\'t have a matching card, tap the draw pile to pick a new card from the deck.',
    icon: '🃏',
    visualType: 'turn'
  },
  {
    step: 5,
    tag: 'SOCIAL EMOTES',
    title: 'Opponent Reactions',
    highlight: 'React to other players using the reaction button.',
    description: 'Tap the 😎 reaction button to send live expressive emojis (😈, 🔥, 😱, 😤, 👑) with satisfying physical audio feedback!',
    icon: '😎',
    visualType: 'reactions'
  },
  {
    step: 6,
    tag: 'AUDIO CONTROLS',
    title: 'Music & Sound',
    highlight: 'Separate controls for music atmosphere and physical SFX.',
    items: [
      { badge: '🎵 MUSIC', text: 'Controls procedural synth pads customized for each of the 5 arenas.' },
      { badge: '🔊 SOUND', text: 'Controls card taps, whooshes, +2/+4 frustration impacts, and victory fanfares.' }
    ],
    icon: '🎵',
    visualType: 'audio'
  },
  {
    step: 7,
    tag: 'VICTORY',
    title: 'Ready for the Arena?',
    highlight: 'Let\'s Play & Claim Your Crown!',
    description: 'Master the card strategies, shout UNO with confidence, and rise through the Arena Leaderboards!',
    icon: '🏆',
    visualType: 'ready'
  }
];

export default function HowToPlayModal({ isOpen, onClose, onStartGame }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const stepData = TUTORIAL_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    try { audioService.playButtonClick?.(); } catch {}
    if (isLast) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    try { audioService.playButtonClick?.(); } catch {}
    if (!isFirst) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    try { audioService.playButtonClick?.(); } catch {}
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('uno_tutorial_completed', 'true');
    }
    onClose?.();
    onStartGame?.();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 4, 14, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={handleComplete}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'linear-gradient(180deg, rgba(32, 22, 54, 0.96) 0%, rgba(16, 11, 28, 0.98) 100%)',
          border: '2px solid var(--gold-main)',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(212, 175, 55, 0.3)',
          padding: '24px 20px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>{stepData.icon}</span>
            <span
              style={{
                fontFamily: 'var(--font-title)',
                color: 'var(--gold-glow)',
                fontSize: '0.82rem',
                fontWeight: 900,
                letterSpacing: '1px',
                background: 'rgba(212, 175, 55, 0.15)',
                padding: '3px 10px',
                borderRadius: '999px',
                border: '1px solid rgba(212, 175, 55, 0.3)'
              }}
            >
              STEP {stepData.step} OF 7 • {stepData.tag}
            </span>
          </div>

          <button
            className="game-btn-circle"
            style={{ width: '32px', height: '32px' }}
            onClick={handleComplete}
            title="Skip Tutorial"
          >
            <X size={16} />
          </button>
        </div>

        {/* Step Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '180px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: '1.45rem',
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              letterSpacing: '0.5px'
            }}
          >
            {stepData.title}
          </h2>

          <div
            style={{
              fontSize: '0.96rem',
              fontWeight: 800,
              color: 'var(--gold-light)',
              lineHeight: 1.35
            }}
          >
            {stepData.highlight}
          </div>

          {stepData.description && (
            <p
              style={{
                fontSize: '0.84rem',
                color: 'rgba(255, 255, 255, 0.78)',
                lineHeight: 1.45,
                margin: 0
              }}
            >
              {stepData.description}
            </p>
          )}

          {stepData.items && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              {stepData.items.map((it, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      color: 'var(--gold-glow)',
                      background: 'rgba(212, 175, 55, 0.2)',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {it.badge}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#FFFFFF', fontWeight: 600 }}>
                    {it.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dots Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '4px 0' }}>
          {TUTORIAL_STEPS.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentStep(i)}
              style={{
                width: currentStep === i ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: currentStep === i ? 'var(--gold-main)' : 'rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
          {!isFirst ? (
            <button
              className="game-btn-pill"
              onClick={handleBack}
              style={{
                padding: '8px 18px',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ChevronLeft size={16} /> Back
            </button>
          ) : (
            <button
              onClick={handleComplete}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                padding: '8px 12px'
              }}
            >
              Skip All
            </button>
          )}

          <button
            className={isLast ? "game-btn-play" : "btn-royal"}
            onClick={handleNext}
            style={{
              padding: isLast ? '10px 28px' : '10px 22px',
              fontSize: '0.92rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isLast ? "START GAME ⚔️" : "Next ❯"}
          </button>
        </div>
      </div>
    </div>
  );
}
