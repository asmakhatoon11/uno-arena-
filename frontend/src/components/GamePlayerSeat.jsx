import React from 'react';
import OpponentCardFan from './OpponentCardFan';

export default function GamePlayerSeat({
  player,
  position = 'top', // 'top', 'left', 'right', 'bottom', 'top-left', 'top-right', etc.
  isActiveTurn = false,
  turnTimeLeft = 15,
  maxTurnTime = 15,
  reaction = null,
  penaltyBadge = null,
  isNewJoin = false,
  emotion = 'normal', // 'normal', 'thinking', 'shocked', 'cheering', 'frustrated', 'dizzy'
  onCatchUno
}) {
  if (!player) return null;

  // SVG Circular Dashoffset for active timer
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.max(0, Math.min(1, turnTimeLeft / maxTurnTime));
  const strokeDashoffset = circumference * (1 - progressRatio);

  const cardCount = player.cardCount ?? (player.hand ? player.hand.length : 0);

  const getEmotionEmoji = () => {
    if (emotion === 'frustrated') return '😤';
    if (emotion === 'shocked') return '😱';
    if (emotion === 'dizzy') return '😵';
    if (emotion === 'cheering') return '🤩';
    if (emotion === 'thinking') return '🤔';
    return player.avatar || '🦁';
  };

  return (
    <div
      className={`game-seat-frame seat-${position} ${isActiveTurn ? 'active-turn' : ''} ${penaltyBadge ? 'seat-impact-shake' : ''}`}
    >
      {/* Floating Joined Feedback Badge for new players */}
      {isNewJoin && (
        <div className="seat-joined-badge">
          <span>✨ JOINED</span>
        </div>
      )}

      {/* Floating Reaction Bubble */}
      {reaction && (
        <div className="seat-reaction-bubble">
          <span style={{ fontSize: '1.8rem' }}>{reaction.emote}</span>
          {reaction.phrase && (
            <span className="seat-reaction-text">{reaction.phrase}</span>
          )}
        </div>
      )}

      {/* Floating Extra Card / Penalty Badge (+2, +4, CAUGHT) */}
      {penaltyBadge && (
        <div className={`seat-penalty-badge penalty-${penaltyBadge.type || 'draw'}`}>
          <span className="penalty-badge-icon">💥</span>
          <span className="penalty-badge-text">{penaltyBadge.text}</span>
        </div>
      )}

      {/* Main Seat Layout Wrapper */}
      <div className={`seat-cluster-layout layout-${position}`}>
        {/* For right seats, card fan faces the table */}
        {position.includes('right') && (
          <OpponentCardFan cardCount={cardCount} position="right" />
        )}

        <div className="seat-avatar-column">
          {/* Avatar Medallion with Flaming Turn Ring */}
          <div className="seat-portrait-circle">
            {isActiveTurn && (
              <svg className="seat-timer-ring-svg" viewBox="0 0 66 66">
                <circle
                  className="seat-timer-ring-path"
                  cx="33"
                  cy="33"
                  r={radius}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
            )}

            {/* Emotion or Avatar */}
            <span className="seat-avatar-glyph">{getEmotionEmoji()}</span>

            {/* Card Count Badge */}
            <div className="seat-card-fan-badge" title={`${cardCount} cards`}>
              <span style={{ fontSize: '0.65rem' }}>🂠</span>
              <span>{cardCount}</span>
            </div>
          </div>

          {/* Player Name */}
          <div className="seat-name-plate">
            {player.name}
          </div>

          {/* Catch UNO Alert Button if opponent forgot to call UNO */}
          {cardCount === 1 && !player.hasCalledUno && !player.isSelf && onCatchUno && (
            <button
              className="game-btn-red"
              style={{ padding: '4px 10px', fontSize: '0.72rem', marginTop: '4px' }}
              onClick={() => onCatchUno(player.id)}
            >
              🚨 CATCH!
            </button>
          )}
        </div>

        {/* For top seats, the card fan is below the avatar */}
        {position.includes('top') && !position.includes('right') && (
          <OpponentCardFan cardCount={cardCount} position="top" />
        )}

        {/* For left seats, the card fan faces the table */}
        {(position === 'left' || position === 'bottom-left' || (position.includes('left') && !position.includes('top'))) && (
          <OpponentCardFan cardCount={cardCount} position="left" />
        )}
      </div>
    </div>
  );
}
