import React from 'react';
import { CARD_TYPES, COLORS } from '../utils/constants';

export default function Card({
  card,
  isPlayable = false,
  isSelected = false,
  isInvalid = false,
  isBack = false,
  size = 'md', // 'sm', 'md', 'lg'
  onClick,
  style = {}
}) {
  if (isBack || !card) {
    return (
      <div
        className={`arena-card card-back size-${size}`}
        style={style}
        onClick={onClick}
      >
        <div className="card-back-pattern">
          <span className="card-back-logo">UNO ARENA</span>
        </div>
      </div>
    );
  }

  const { color, type, value } = card;

  const getColorClass = () => {
    switch (color) {
      case COLORS.RED: return 'color-red';
      case COLORS.BLUE: return 'color-blue';
      case COLORS.GREEN: return 'color-green';
      case COLORS.YELLOW: return 'color-yellow';
      case COLORS.WILD: return 'color-wild';
      default: return 'color-wild';
    }
  };

  const renderSymbol = () => {
    switch (type) {
      case CARD_TYPES.NUMBER:
        return <span>{value}</span>;
      case CARD_TYPES.SKIP:
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        );
      case CARD_TYPES.REVERSE:
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <polyline points="8 8 3 8 3 3" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <polyline points="16 16 21 16 21 21" />
          </svg>
        );
      case CARD_TYPES.DRAW_TWO:
        return <span>+2</span>;
      case CARD_TYPES.WILD_DRAW_FOUR:
        return <span>+4</span>;
      case CARD_TYPES.WILD:
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      default:
        return <span>{value}</span>;
    }
  };

  const cornerLabel = () => {
    if (type === CARD_TYPES.NUMBER) return value;
    if (type === CARD_TYPES.DRAW_TWO) return '+2';
    if (type === CARD_TYPES.WILD_DRAW_FOUR) return '+4';
    if (type === CARD_TYPES.SKIP) return '⊘';
    if (type === CARD_TYPES.REVERSE) return '⇄';
    if (type === CARD_TYPES.WILD) return '★';
    return value;
  };

  return (
    <div
      className={`arena-card ${getColorClass()} size-${size} ${isPlayable ? 'playable' : ''} ${isSelected ? 'selected' : ''} ${isInvalid ? 'invalid-shake' : ''}`}
      style={style}
      onClick={onClick}
    >
      <div className="card-corner corner-top-left">{cornerLabel()}</div>
      <div className="card-inner-oval" />
      <div className="card-center-symbol">{renderSymbol()}</div>
      <div className="card-corner corner-bottom-right">{cornerLabel()}</div>
    </div>
  );
}
