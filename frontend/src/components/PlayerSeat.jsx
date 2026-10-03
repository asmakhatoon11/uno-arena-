import React from 'react';

export default function PlayerSeat({
  player,
  position = 'top', // 'top', 'left', 'right', 'bottom'
  isActiveTurn = false,
  turnTimeLeft = 15,
  maxTurnTime = 15,
  reaction = null,
  onCatchUno
}) {
  if (!player) return null;

  // Calculate SVG stroke offset for turn timer circle
  const radius = 27;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.max(0, Math.min(1, turnTimeLeft / maxTurnTime));
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div className={`player-seat seat-${position} ${isActiveTurn ? 'is-active-turn' : ''}`}>
      {/* Floating Reaction Bubble */}
      {reaction && (
        <div className="floating-reaction">
          <span style={{ fontSize: '1.8rem' }}>{reaction.emote}</span>
          {reaction.phrase && (
            <span className="floating-phrase">{reaction.phrase}</span>
          )}
        </div>
      )}

      {/* Avatar Container with Timer Ring */}
      <div className="seat-avatar-box">
        {isActiveTurn && (
          <svg className="turn-timer-ring" viewBox="0 0 62 62">
            <circle
              className="turn-timer-circle"
              cx="31"
              cy="31"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
        )}

        <span>{player.avatar || '👑'}</span>

        {/* Card Count Pill */}
        <div className="seat-card-count-badge" title={`${player.cardCount} cards`}>
          {player.cardCount ?? (player.hand ? player.hand.length : 0)}
        </div>
      </div>

      <div className="seat-player-name">
        {player.name}
      </div>

      {/* Target for UNO catch if opponent has 1 card without calling */}
      {player.cardCount === 1 && !player.hasCalledUno && !player.isSelf && onCatchUno && (
        <button
          className="btn-catch-uno"
          style={{ marginTop: '4px' }}
          onClick={() => onCatchUno(player.id)}
        >
          🚨 Catch!
        </button>
      )}
    </div>
  );
}
