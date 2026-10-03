import React, { useState, useEffect } from 'react';
import GameCard from './GameCard';
import { audioService } from '../services/audioService';

/**
 * CardHand — Authentic Arced 3D Mobile & Desktop Card Hand
 * Dynamically fans cards along a parabolic arc with smooth tilt,
 * adaptive overlap across viewports (mobile 320px–390px to desktop 1920px),
 * and tactile hover/touch lift interactions with real playable cues.
 */
export default function CardHand({
  cards = [],
  playableCardIds = new Set(),
  isMyTurn = false,
  onPlayCard
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [shakingCardId, setShakingCardId] = useState(null);
  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 390));
  const [windowHeight, setWindowHeight] = useState(() => (typeof window !== 'undefined' ? window.innerHeight : 844));

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const isTouchDevice = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;
  const isLandscapeMobile = isTouchDevice && windowWidth > windowHeight;
  const isDesktop = windowWidth >= 768 && !isLandscapeMobile;
  const count = cards.length;
  const mid = (count - 1) / 2;

  // Adaptive hand span and card dimension based on viewport
  const maxHandSpan = isDesktop 
    ? Math.min(860, windowWidth - 200) 
    : (isLandscapeMobile ? Math.min(540, windowWidth - 140) : Math.min(350, windowWidth - 32));
  const cardWidth = isDesktop ? 86 : (isLandscapeMobile ? 58 : 74);

  // Dynamic spacing: allow comfortable separation on desktop, compressed overlap on small screens
  const maxSpacing = isDesktop ? 62 : (isLandscapeMobile ? 32 : 36);
  const spacing = count <= 1 
    ? 0 
    : Math.min(maxSpacing, (maxHandSpan - cardWidth) / Math.max(1, count - 1));

  // Dynamic fan angle spread: clamp total spread to avoid excessive tilt
  const maxAngle = count <= 1 
    ? 0 
    : Math.min(isDesktop ? 18 : (isLandscapeMobile ? 12 : 15), count * (isDesktop ? 2.2 : (isLandscapeMobile ? 1.6 : 2.4)));

  const handleCardClick = (card, e) => {
    if (!isMyTurn || !playableCardIds.has(card.id)) {
      triggerShake(card.id);
      return;
    }

    if (onPlayCard) {
      onPlayCard(card, e);
    }
  };

  const triggerShake = (cardId) => {
    setShakingCardId(cardId);
    audioService.playButtonClick();
    setTimeout(() => {
      setShakingCardId(null);
    }, 450);
  };

  return (
    <div className={`player-hand-arc-container ${isDesktop ? 'desktop-hand' : ''}`}>
      {cards.map((card, index) => {
        const isPlayable = isMyTurn && playableCardIds.has(card.id);
        const isShaking = shakingCardId === card.id;
        const isHovered = hoveredIndex === index;

        // Mathematical offset from center
        const offset = index - mid;

        // Horizontal displacement from center
        const xPos = offset * spacing;

        // Parabolic vertical drop: outer cards dip slightly lower for authentic hand feel
        const normDist = count > 1 ? Math.abs(offset) / Math.max(1, mid) : 0;
        const yArc = count > 1 ? Math.pow(normDist, 1.6) * (isDesktop ? 14 : 11) : 0;

        // Fan angle: negative on left, positive on right
        const angle = count <= 1 ? 0 : offset * (maxAngle / Math.max(1, mid));

        // When hovered/touched, lift upward and straighten rotation
        const liftDist = isDesktop ? 34 : (isLandscapeMobile ? 18 : 26);
        const finalY = isHovered ? yArc - liftDist : yArc;
        const finalAngle = isHovered ? 0 : angle;
        const finalScale = isHovered ? (isDesktop ? 1.15 : (isLandscapeMobile ? 1.08 : 1.12)) : 1;
        const finalZIndex = isHovered ? 120 : index + 1;

        return (
          <div
            key={card.id || index}
            className={`hand-card-arc-slot ${isHovered ? 'is-lifted' : ''}`}
            style={{
              transform: `translate3d(${xPos}px, ${finalY}px, 0) rotate(${finalAngle}deg) scale(${finalScale})`,
              zIndex: finalZIndex,
              transition: isHovered 
                ? 'transform 0.16s cubic-bezier(0.18, 0.89, 0.32, 1.28), z-index 0s' 
                : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), z-index 0.2s'
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onTouchStart={() => setHoveredIndex(index)}
            onTouchEnd={() => setTimeout(() => setHoveredIndex(null), 350)}
          >
            {/* Playable indicator chevron */}
            {isPlayable && (
              <div className="card-playable-indicator">
                ▲
              </div>
            )}

            <GameCard
              card={card}
              isPlayable={isPlayable}
              isInvalid={isShaking}
              size={isDesktop ? 'lg' : (isLandscapeMobile ? 'sm' : 'md')}
              onClick={(e) => handleCardClick(card, e)}
            />
          </div>
        );
      })}
    </div>
  );
}
