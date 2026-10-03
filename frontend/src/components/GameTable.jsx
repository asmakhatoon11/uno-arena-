import React, { useState, useEffect } from 'react';
import GameCard from './GameCard';
import { COLORS } from '../utils/constants';

export default function GameTable({
  topCard,
  currentColor,
  deckRemaining = 50,
  direction = 1,
  onDrawCard,
  isMyTurn = false,
  discardShake = false,
  activeArena = 'ROYAL_PALACE',
  theme
}) {
  const normArena = (activeArena || 'ROYAL_PALACE').toUpperCase();

  const [currentTheme, setCurrentTheme] = useState(() => {
    if (theme) return theme;
    if (typeof document !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme) {
      setCurrentTheme(theme);
      return;
    }
    const observer = new MutationObserver(() => {
      const active = document.documentElement.getAttribute('data-theme') || 'dark';
      setCurrentTheme(active);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [theme]);

  const isLight = currentTheme === 'light';

  const getArenaFeltStyle = () => {
    switch (normArena) {
      case 'CHAMPIONSHIP':
        return isLight ? {
          background: 'radial-gradient(ellipse at 50% 45%, #22327A 0%, #131E4E 50%, #090E26 100%)',
          borderColor: '#FFCC00',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.8), 0 0 55px rgba(255, 204, 0, 0.45), inset 0 0 55px rgba(0, 0, 0, 0.75)'
        } : {
          background: 'radial-gradient(ellipse at 50% 45%, #251648 0%, #170E2F 50%, #0B0618 100%)',
          borderColor: '#FFD60A',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.9), 0 0 50px rgba(255, 214, 10, 0.4), inset 0 0 55px rgba(0, 0, 0, 0.85)'
        };
      case 'NEON_CITY':
      case 'NEON_NIGHT':
        return isLight ? {
          background: 'radial-gradient(ellipse at 50% 45%, #153966 0%, #0C2342 50%, #051122 100%)',
          borderColor: '#00B8FF',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.8), 0 0 55px rgba(0, 184, 255, 0.45), inset 0 0 55px rgba(0, 0, 0, 0.75)'
        } : {
          background: 'radial-gradient(ellipse at 50% 45%, #0F2038 0%, #081324 50%, #040914 100%)',
          borderColor: '#00F0FF',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.9), 0 0 50px rgba(0, 240, 255, 0.4), inset 0 0 55px rgba(0, 0, 0, 0.85)'
        };
      case 'SUNSET_BEACH':
      case 'BEACH':
        return isLight ? {
          background: 'radial-gradient(ellipse at 50% 45%, #0E6875 0%, #084752 50%, #04272C 100%)',
          borderColor: '#00C7BE',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.8), 0 0 55px rgba(0, 199, 190, 0.45), inset 0 0 55px rgba(0, 0, 0, 0.75)'
        } : {
          background: 'radial-gradient(ellipse at 50% 45%, #3D1929 0%, #260E1A 50%, #13060D 100%)',
          borderColor: '#FF9500',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.9), 0 0 50px rgba(255, 149, 0, 0.4), inset 0 0 55px rgba(0, 0, 0, 0.85)'
        };
      case 'MYSTIC_FOREST':
      case 'PARK':
      case 'COZY_PARK':
        return isLight ? {
          background: 'radial-gradient(ellipse at 50% 45%, #1C6937 0%, #104824 50%, #072B15 100%)',
          borderColor: '#34C759',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.8), 0 0 55px rgba(52, 199, 89, 0.45), inset 0 0 55px rgba(0, 0, 0, 0.75)'
        } : {
          background: 'radial-gradient(ellipse at 50% 45%, #143522 0%, #0C2115 50%, #050F09 100%)',
          borderColor: '#30D158',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.9), 0 0 50px rgba(48, 209, 88, 0.4), inset 0 0 55px rgba(0, 0, 0, 0.85)'
        };
      case 'CINEMA_HALL':
      case 'CINEMA':
      case 'ROOFTOP':
        return isLight ? {
          background: 'radial-gradient(ellipse at 50% 45%, #561625 0%, #350D17 50%, #1C060C 100%)',
          borderColor: '#FF453A',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.8), 0 0 55px rgba(255, 69, 58, 0.45), inset 0 0 55px rgba(0, 0, 0, 0.75)'
        } : {
          background: 'radial-gradient(ellipse at 50% 45%, #380E18 0%, #20080E 50%, #0E0306 100%)',
          borderColor: '#FF3B30',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.9), 0 0 50px rgba(255, 59, 48, 0.4), inset 0 0 55px rgba(0, 0, 0, 0.85)'
        };
      case 'ROYAL_PALACE':
      case 'ROYAL_GARDEN':
      default:
        return isLight ? {
          background: 'radial-gradient(ellipse at 50% 45%, #462C6E 0%, #2B1A46 50%, #160D25 100%)',
          borderColor: 'var(--gold-main)',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.8), 0 0 55px rgba(212, 175, 55, 0.45), inset 0 0 55px rgba(0, 0, 0, 0.75)'
        } : {
          background: 'radial-gradient(ellipse at 50% 45%, #2B1842 0%, #1A0E2A 50%, #0F0719 100%)',
          borderColor: 'var(--gold-main)',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.9), 0 0 50px rgba(212, 175, 55, 0.35), inset 0 0 55px rgba(0, 0, 0, 0.85)'
        };
    }
  };

  const getVortexColor = () => {
    switch (currentColor) {
      case COLORS.RED: return 'radial-gradient(circle, rgba(255, 59, 48, 0.85) 0%, transparent 70%)';
      case COLORS.BLUE: return 'radial-gradient(circle, rgba(10, 132, 255, 0.85) 0%, transparent 70%)';
      case COLORS.GREEN: return 'radial-gradient(circle, rgba(48, 209, 88, 0.85) 0%, transparent 70%)';
      case COLORS.YELLOW: return 'radial-gradient(circle, rgba(255, 214, 10, 0.85) 0%, transparent 70%)';
      default: return 'radial-gradient(circle, rgba(212, 175, 55, 0.85) 0%, transparent 70%)';
    }
  };

  return (
    <div className={`grand-felt-table arena-${normArena.toLowerCase()} ${isLight ? 'mode-light' : 'mode-dark'}`} style={getArenaFeltStyle()}>
      {/* Ambient Table Spotlight */}
      <div className="table-ambient-spotlight" />

      {/* Orbit Direction Ring */}
      <div className={`table-orbit-ring ${direction === -1 ? 'counter' : ''}`}>
        <span className="orbit-chevron">▲</span>
        <span className="orbit-chevron">▼</span>
      </div>

      {/* Center Piles Hub */}
      <div className="table-piles-hub">
        {/* Giant 3D Discard Pile */}
        <div className={`pile-discard-container ${discardShake ? 'discard-bounce' : ''}`}>
          <div
            className="pile-color-vortex"
            style={{ background: getVortexColor() }}
          />
          {topCard ? (
            <GameCard
              card={topCard}
              size="lg"
              style={{ transform: 'rotate(-5deg)' }}
            />
          ) : (
            <div className="game-card-3d size-lg" />
          )}
        </div>

        {/* Giant 3D Draw Deck Stack */}
        <div
          className="pile-deck-container"
          onClick={isMyTurn ? onDrawCard : undefined}
          title={isMyTurn ? 'Tap to Draw Card' : 'Draw Pile'}
        >
          {/* Stack depth layers */}
          <div className="pile-deck-layer l1" />
          <div className="pile-deck-layer l2" />
          <div className="pile-deck-layer l3" />

          <GameCard isBack={true} size="lg" />

          {/* Tap Prompt Badge */}
          {isMyTurn && (
            <div className="deck-tap-prompt">
              TAP TO DRAW ({deckRemaining})
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
