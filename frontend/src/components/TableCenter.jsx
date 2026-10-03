import React from 'react';
import Card from './Card';
import { COLORS } from '../utils/constants';

export default function TableCenter({
  topCard,
  currentColor,
  deckRemaining = 50,
  direction = 1,
  onDrawCard,
  isMyTurn = false
}) {
  const getColorHaloStyle = () => {
    switch (currentColor) {
      case COLORS.RED: return 'radial-gradient(circle, #FF3B30 0%, transparent 70%)';
      case COLORS.BLUE: return 'radial-gradient(circle, #0A84FF 0%, transparent 70%)';
      case COLORS.GREEN: return 'radial-gradient(circle, #30D158 0%, transparent 70%)';
      case COLORS.YELLOW: return 'radial-gradient(circle, #FFD60A 0%, transparent 70%)';
      default: return 'radial-gradient(circle, #D4AF37 0%, transparent 70%)';
    }
  };

  return (
    <div className="table-center-hub">
      {/* Direction Orbiting Arrows */}
      <div className={`direction-orbit ${direction === -1 ? 'counter-clockwise' : ''}`}>
        <span className="orbit-arrow">▲</span>
        <span className="orbit-arrow">▼</span>
      </div>

      {/* Discard Pile with Color Halo */}
      <div className="discard-pile-wrapper">
        <div
          className="discard-color-halo"
          style={{ background: getColorHaloStyle() }}
        />
        {topCard ? (
          <Card
            card={topCard}
            size="lg"
            style={{ transform: 'rotate(-4deg)' }}
          />
        ) : (
          <div className="arena-card size-lg" />
        )}
      </div>

      {/* Draw Deck with 3D Layer Stack */}
      <div
        className="draw-deck-wrapper"
        onClick={isMyTurn ? onDrawCard : undefined}
        title={isMyTurn ? "Tap to Draw Card" : "Draw Deck"}
      >
        <Card isBack={true} size="lg" />
        <div className="deck-count-pill">
          {deckRemaining} Cards
        </div>
      </div>
    </div>
  );
}
