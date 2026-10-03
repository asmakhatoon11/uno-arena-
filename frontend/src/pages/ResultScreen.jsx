import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home } from 'lucide-react';
import EnvironmentLayer from '../components/EnvironmentLayer';
import { audioService } from '../services/audioService';

export default function ResultScreen({
  resultData,
  onPlayAgain,
  onGoHome
}) {
  const isWin = resultData?.isWinner ?? true;
  const coinsReward = resultData?.rewards?.coins || 160;
  const xpReward = resultData?.rewards?.xp || 220;

  const [coinsCount, setCoinsCount] = useState(0);
  const [xpCount, setXpCount] = useState(0);
  const [chestPopped, setChestPopped] = useState(false);

  useEffect(() => {
    if (isWin) {
      audioService.playVictory();
      try {
        confetti({
          particleCount: 160,
          spread: 90,
          origin: { y: 0.5 }
        });
      } catch {}
    } else {
      audioService.playDefeat();
    }

    // Chest open animation & counter
    const tChest = setTimeout(() => {
      setChestPopped(true);
      audioService.playCoin();

      const cInt = setInterval(() => {
        setCoinsCount(prev => {
          if (prev >= coinsReward) {
            clearInterval(cInt);
            return coinsReward;
          }
          return Math.min(coinsReward, prev + 20);
        });
      }, 35);

      const xInt = setInterval(() => {
        setXpCount(prev => {
          if (prev >= xpReward) {
            clearInterval(xInt);
            return xpReward;
          }
          return Math.min(xpReward, prev + 25);
        });
      }, 35);
    }, 600);

    return () => clearTimeout(tChest);
  }, [isWin, coinsReward, xpReward]);

  return (
    <div className="result-page-root">
      <EnvironmentLayer arenaId={isWin ? 'CHAMPIONSHIP' : 'ROYAL_PALACE'} />

      <div className="result-scene-container">
        {/* Victory / Defeat Grand Emblem */}
        <div className="result-title-section">
          <div className="result-emblem-glyph">
            {isWin ? '👑' : '⚔️'}
          </div>
          <div className={`result-headline ${isWin ? 'gold-text' : 'red-text'}`}>
            {isWin ? 'VICTORY!' : 'DEFEAT'}
          </div>
          <div className="result-tagline">
            {isWin ? 'YOU ARE THE SUPREME ARENA CHAMPION' : 'VALIANT COMBAT IN THE ROYAL ARENA'}
          </div>
        </div>

        {/* 3D Spoils Chest */}
        <div className="result-spoils-box">
          <div className={`result-chest-art ${chestPopped ? 'opened' : ''}`}>
            {chestPopped ? '🎁' : '📦'}
          </div>

          <div className="result-spoils-title gold-text">MATCH SPOILS</div>

          <div className="result-counters-row">
            {/* Coins Counter */}
            <div className="result-counter-pod">
              <span className="counter-icon">🪙</span>
              <span className="counter-value gold-text">+{coinsCount}</span>
              <span className="counter-label">COINS</span>
            </div>

            {/* XP Counter */}
            <div className="result-counter-pod">
              <span className="counter-icon">⭐</span>
              <span className="counter-value" style={{ color: '#00F0FF' }}>+{xpCount}</span>
              <span className="counter-label">EXP</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="result-buttons-section">
          <button
            className="game-btn-play"
            style={{ width: '100%', fontSize: '1.25rem' }}
            onClick={() => {
              audioService.playButtonClick();
              onPlayAgain();
            }}
          >
            <RotateCcw size={22} />
            <span>PLAY AGAIN</span>
          </button>

          <button
            className="game-btn-pill"
            style={{ width: '100%', padding: '12px' }}
            onClick={() => {
              audioService.playButtonClick();
              onGoHome();
            }}
          >
            <Home size={18} />
            <span>RETURN TO LOBBY</span>
          </button>
        </div>
      </div>
    </div>
  );
}
