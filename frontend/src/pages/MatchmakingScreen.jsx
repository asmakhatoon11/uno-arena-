import React, { useState, useEffect } from 'react';
import EnvironmentLayer from '../components/EnvironmentLayer';
import { audioService } from '../services/audioService';

export default function MatchmakingScreen({ onMatchFound, onCancel, playerProfile }) {
  const [seconds, setSeconds] = useState(0);
  const [statusText, setStatusText] = useState('SEARCHING FOR WARRIORS...');
  const [matchedPlayers, setMatchedPlayers] = useState([
    { name: playerProfile?.name || 'You', avatar: playerProfile?.avatar || '🦁' }
  ]);
  const [countdown, setCountdown] = useState(null);

  // Search Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulated player matchmaking progression (players join 1 by 1 with audio cues)
  useEffect(() => {
    const pool = [
      { name: 'Duchess Vesper', avatar: '⚔️' },
      { name: 'Lord Aiden', avatar: '👑' },
      { name: 'Archmage Zephyr', avatar: '💎' }
    ];

    const t1 = setTimeout(() => {
      setMatchedPlayers(prev => [...prev, pool[0]]);
      audioService.playButtonClick();
    }, 1100);

    const t2 = setTimeout(() => {
      setMatchedPlayers(prev => [...prev, pool[1]]);
      audioService.playButtonClick();
    }, 2200);

    const t3 = setTimeout(() => {
      setMatchedPlayers(prev => [...prev, pool[2]]);
      setStatusText('WARRIORS FOUND! PREPARE!');
      audioService.playTurn();
      startCountdown();
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const startCountdown = () => {
    let count = 5;
    setCountdown(count);

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
        if (count <= 3) {
          audioService.playTimerWarning(count);
        }
      } else if (count === 0) {
        setCountdown('START!');
        audioService.playMatchStart();
      } else {
        clearInterval(interval);
        onMatchFound();
      }
    }, 850);
  };

  return (
    <div className="matchmaking-page-root">
      <EnvironmentLayer arenaId={playerProfile?.activeArena || 'ROYAL_PALACE'} />

      <div className="matchmaking-scene-body">
        {/* Top Search Title */}
        <div className="matchmaking-header">
          <div className="matchmaking-title gold-text">MATCHMAKING</div>
          <div className="matchmaking-status-pill">{statusText}</div>
          <div className="matchmaking-timer">⏱️ 0:{seconds < 10 ? `0${seconds}` : seconds}</div>
        </div>

        {/* Center Radar / Orbiting Cards */}
        <div className="matchmaking-center-core">
          <div className="radar-orbit-ring r1" />
          <div className="radar-orbit-ring r2" />
          <div className="radar-orbit-ring r3" />

          {countdown !== null ? (
            <div className="matchmaking-countdown-hero gold-text">
              {countdown}
            </div>
          ) : (
            <div className="matchmaking-floating-card">
              <span style={{ fontSize: '2.5rem' }}>👑</span>
            </div>
          )}
        </div>

        {/* 4 Player Joining Pods */}
        <div className="matchmaking-slots-row">
          {[0, 1, 2, 3].map((idx) => {
            const player = matchedPlayers[idx];

            return (
              <div
                key={idx}
                className={`match-slot-pod ${player ? 'filled' : 'empty'}`}
              >
                <div className="slot-avatar-circle">
                  {player ? player.avatar : '👤'}
                </div>
                <div className="slot-player-label">
                  {player ? player.name : 'Searching...'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cancel Button */}
        {countdown === null && (
          <div style={{ marginTop: '14px', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <button
              className="game-btn-red"
              onClick={() => {
                audioService.playButtonClick();
                onCancel();
              }}
            >
              CANCEL SEARCH
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
