import React, { useState, useEffect } from 'react';
import { audioService } from '../services/audioService';

export default function CinematicMatchStart({ starterCard, onComplete }) {
  const [phase, setPhase] = useState('ASSEMBLE'); // 'ASSEMBLE', 'SHUFFLE', 'DEAL', 'FLIP', 'COUNTDOWN', 'START'
  const [countdown, setCountdown] = useState(3);
  const [dealtCount, setDealtCount] = useState(0);

  useEffect(() => {
    // 1. Players Assemble
    audioService.playWhoosh();
    const tShuffle = setTimeout(() => {
      setPhase('SHUFFLE');
      audioService.playCardSlam();

      // 2. Deal animation (rapid card dealing)
      const tDeal = setTimeout(() => {
        setPhase('DEAL');
        let dealt = 0;
        const dealInterval = setInterval(() => {
          dealt++;
          setDealtCount(dealt);
          audioService.playDeal();
          if (dealt >= 7) {
            clearInterval(dealInterval);

            // 3. Flip Starter Card
            setTimeout(() => {
              setPhase('FLIP');
              audioService.playCard();

              // 4. Countdown 3-2-1
              setTimeout(() => {
                setPhase('COUNTDOWN');
                startCountdownTimer();
              }, 600);
            }, 400);
          }
        }, 120);
      }, 700);

    }, 800);

    return () => clearTimeout(tShuffle);
  }, []);

  const startCountdownTimer = () => {
    let count = 3;
    setCountdown(count);
    audioService.playTimerWarning(3);

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
        audioService.playTimerWarning(count);
      } else if (count === 0) {
        setCountdown('PLAY!');
        audioService.playMatchStart();
      } else {
        clearInterval(interval);
        onComplete();
      }
    }, 700);
  };

  return (
    <div className="match-start-overlay">
      {/* Skip Button */}
      <button
        className="match-start-skip-btn"
        onClick={onComplete}
      >
        SKIP INTRO ❯
      </button>

      {/* Phase 1: Players Assemble */}
      {phase === 'ASSEMBLE' && (
        <div className="match-intro-banner">
          <div className="intro-title gold-text">WARRIORS ASSEMBLE!</div>
          <div className="intro-sub">Entering the Royal Arena</div>
        </div>
      )}

      {/* Phase 2: Deck Shuffling */}
      {phase === 'SHUFFLE' && (
        <div className="match-intro-banner">
          <div className="intro-icon">🃏</div>
          <div className="intro-title gold-text">SHUFFLING DECK</div>
          <div className="intro-sub">Preparing 108 Sacred Cards</div>
        </div>
      )}

      {/* Phase 3: Dealing Cards */}
      {phase === 'DEAL' && (
        <div className="match-intro-banner">
          <div className="intro-icon">🂠</div>
          <div className="intro-title gold-text">DEALING HANDS</div>
          <div className="intro-sub">Dealing {dealtCount} / 7 Cards</div>
        </div>
      )}

      {/* Phase 4: Flip Starter Card */}
      {phase === 'FLIP' && (
        <div className="match-intro-banner">
          <div className="intro-title gold-text">FIRST CARD REVEAL!</div>
          <div className="intro-sub">{starterCard?.color} {starterCard?.value}</div>
        </div>
      )}

      {/* Phase 5: Countdown */}
      {phase === 'COUNTDOWN' && (
        <div className="match-countdown-display">
          <div className="countdown-number gold-text">
            {countdown}
          </div>
        </div>
      )}
    </div>
  );
}
