import React from 'react';

export default function SpecialEffectsOverlay({ effect }) {
  if (!effect) return null;

  const { type, message, targetPlayerName } = effect;

  return (
    <div className="vfx-master-overlay">
      {/* 1. Skip Barrier */}
      {type === 'SKIP' && (
        <div className="vfx-skip-barrier-slam">
          <div className="skip-symbol">⊘</div>
          <div className="vfx-banner-text">TURN SKIPPED!</div>
        </div>
      )}

      {/* 2. Reverse Vortex */}
      {type === 'REVERSE' && (
        <div className="vfx-reverse-vortex-ring">
          <div className="reverse-arrows">⇄</div>
          <div className="vfx-banner-text">DIRECTION REVERSED!</div>
        </div>
      )}

      {/* 3. Draw Two Missile Barrage */}
      {type === 'DRAW_TWO' && (
        <div className="vfx-missile-burst">
          <div className="missile-card m1">+2</div>
          <div className="missile-card m2">+2</div>
          <div className="vfx-banner-text">+2 ATTACK ON {targetPlayerName || 'OPPONENT'}!</div>
        </div>
      )}

      {/* 4. Wild Nova */}
      {type === 'WILD' && (
        <div className="vfx-wild-nova">
          <div className="nova-crystal">★</div>
          <div className="vfx-banner-text">WILD COLOR POWER!</div>
        </div>
      )}

      {/* 5. Wild Draw 4 Nova Burst */}
      {type === 'WILD_DRAW_FOUR' && (
        <div className="vfx-wild-nova four">
          <div className="nova-crystal">+4</div>
          <div className="vfx-banner-text">WILD +4 ULTIMATE STRIKE!</div>
        </div>
      )}

      {/* 6. Dramatic Full-Screen UNO Shout */}
      {type === 'UNO' && (
        <div className="vfx-uno-slam-screen">
          <div className="uno-gold-crest">👑</div>
          <div className="uno-big-title">UNO!</div>
          <div className="uno-shout-actor">{message || 'DOWN TO ONE CARD!'}</div>
        </div>
      )}
    </div>
  );
}
