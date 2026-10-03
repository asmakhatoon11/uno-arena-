import React from 'react';
import GameCard from './GameCard';

/**
 * OpponentCardFan — Physical Card Backs Fan for Rivals
 * Renders physical card backs fanned gracefully based on player.cardCount.
 * 
 * Supports:
 * - 'top': Horizontal downward-curved arc of card backs facing the table.
 * - 'left': Inward-pointing fanned stack facing towards the center table.
 * - 'right': Inward-pointing fanned stack facing towards the center table.
 */
export default function OpponentCardFan({
  cardCount = 7,
  position = 'top' // 'top' | 'left' | 'right'
}) {
  const count = Math.max(0, cardCount);
  if (count === 0) return null;

  // Maximum visual cards rendered in the fan to avoid DOM bloat or extreme overflow
  const maxVisualCards = Math.min(count, 8);
  const mid = (maxVisualCards - 1) / 2;
  const extraCount = count - maxVisualCards;

  // Top seat: Horizontal curved fan
  if (position === 'top') {
    const spacing = maxVisualCards <= 1 ? 0 : Math.min(18, 120 / Math.max(1, maxVisualCards - 1));
    const maxAngle = maxVisualCards <= 1 ? 0 : Math.min(14, maxVisualCards * 2.5);

    return (
      <div className="opponent-card-fan fan-top">
        <div className="fan-cards-wrapper">
          {Array.from({ length: maxVisualCards }).map((_, i) => {
            const offset = i - mid;
            const xPos = offset * spacing;
            const yArc = maxVisualCards > 1 ? Math.pow(Math.abs(offset) / Math.max(1, mid), 1.5) * 6 : 0;
            const angle = maxVisualCards <= 1 ? 0 : offset * (maxAngle / Math.max(1, mid));

            return (
              <div
                key={i}
                className="opponent-card-slot"
                style={{
                  transform: `translate3d(${xPos}px, ${yArc}px, 0) rotate(${angle}deg)`,
                  zIndex: i + 1
                }}
              >
                <GameCard isBack={true} size="sm" />
              </div>
            );
          })}
        </div>
        {extraCount > 0 && (
          <div className="opponent-extra-pill">+{extraCount}</div>
        )}
      </div>
    );
  }

  // Left seat: Inward fan pointing rightward towards the table
  if (position === 'left') {
    const spacing = maxVisualCards <= 1 ? 0 : Math.min(12, 70 / Math.max(1, maxVisualCards - 1));
    const maxAngle = maxVisualCards <= 1 ? 0 : Math.min(16, maxVisualCards * 3);

    return (
      <div className="opponent-card-fan fan-side fan-left">
        <div className="fan-cards-wrapper vertical">
          {Array.from({ length: maxVisualCards }).map((_, i) => {
            const offset = i - mid;
            const yPos = offset * spacing;
            const xArc = maxVisualCards > 1 ? Math.pow(Math.abs(offset) / Math.max(1, mid), 1.5) * 5 : 0;
            const angle = (offset * (maxAngle / Math.max(1, mid))) + 12;

            return (
              <div
                key={i}
                className="opponent-card-slot side"
                style={{
                  transform: `translate3d(${xArc}px, ${yPos}px, 0) rotate(${angle}deg)`,
                  zIndex: i + 1
                }}
              >
                <GameCard isBack={true} size="sm" />
              </div>
            );
          })}
        </div>
        {extraCount > 0 && (
          <div className="opponent-extra-pill side">+{extraCount}</div>
        )}
      </div>
    );
  }

  // Right seat: Inward fan pointing leftward towards the table
  if (position === 'right') {
    const spacing = maxVisualCards <= 1 ? 0 : Math.min(12, 70 / Math.max(1, maxVisualCards - 1));
    const maxAngle = maxVisualCards <= 1 ? 0 : Math.min(16, maxVisualCards * 3);

    return (
      <div className="opponent-card-fan fan-side fan-right">
        <div className="fan-cards-wrapper vertical">
          {Array.from({ length: maxVisualCards }).map((_, i) => {
            const offset = i - mid;
            const yPos = offset * spacing;
            const xArc = maxVisualCards > 1 ? -(Math.pow(Math.abs(offset) / Math.max(1, mid), 1.5) * 5) : 0;
            const angle = (offset * (maxAngle / Math.max(1, mid))) - 12;

            return (
              <div
                key={i}
                className="opponent-card-slot side"
                style={{
                  transform: `translate3d(${xArc}px, ${yPos}px, 0) rotate(${angle}deg)`,
                  zIndex: i + 1
                }}
              >
                <GameCard isBack={true} size="sm" />
              </div>
            );
          })}
        </div>
        {extraCount > 0 && (
          <div className="opponent-extra-pill side">+{extraCount}</div>
        )}
      </div>
    );
  }

  return null;
}
