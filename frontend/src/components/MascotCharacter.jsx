import React, { useState } from 'react';
import { audioService } from '../services/audioService';

export default function MascotCharacter({ name = 'Aurelius The Sovereign' }) {
  const [isTapped, setIsTapped] = useState(false);

  const handleTap = () => {
    audioService.playButtonClick();
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 800);
  };

  return (
    <div
      className={`mascot-hero-stage ${isTapped ? 'tapped' : ''}`}
      onClick={handleTap}
      title="Tap Sovereign"
    >
      {/* Floating Levitating Cards Orbiting Mascot */}
      <div className="mascot-orbiting-card c1">👑</div>
      <div className="mascot-orbiting-card c2">★</div>
      <div className="mascot-orbiting-card c3">+4</div>

      {/* Hero Character Illustrated Vector (Royal Lion Sovereign) */}
      <div className="mascot-character-art">
        <svg viewBox="0 0 200 240" className="mascot-svg">
          <defs>
            <linearGradient id="goldMane" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF1A8" />
              <stop offset="40%" stopColor="#F5D76E" />
              <stop offset="80%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8C6310" />
            </linearGradient>
            <linearGradient id="armorObsidian" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2E2045" />
              <stop offset="100%" stopColor="#140D20" />
            </linearGradient>
            <linearGradient id="capeScarlet" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B8150D" />
              <stop offset="50%" stopColor="#FF3B30" />
              <stop offset="100%" stopColor="#8A0B05" />
            </linearGradient>
          </defs>

          {/* Flowing Royal Cape */}
          <path
            d="M50,110 Q20,180 30,230 Q100,245 170,230 Q180,180 150,110 Z"
            fill="url(#capeScarlet)"
            className="mascot-cape"
          />

          {/* Armor Shoulders & Chest */}
          <path
            d="M60,120 L140,120 L155,190 L45,190 Z"
            fill="url(#armorObsidian)"
            stroke="#D4AF37"
            strokeWidth="3"
          />
          {/* Gilded Breastplate Emblem */}
          <circle cx="100" cy="155" r="16" fill="url(#goldMane)" />
          <path d="M93,155 L100,145 L107,155 L100,165 Z" fill="#140D20" />

          {/* Sovereign Lion Mane */}
          <path
            d="M100,30 Q150,30 165,80 Q175,130 145,145 Q100,165 55,145 Q25,130 35,80 Q50,30 100,30 Z"
            fill="url(#goldMane)"
            filter="drop-shadow(0 4px 10px rgba(0,0,0,0.5))"
          />

          {/* Face */}
          <circle cx="100" cy="90" r="42" fill="#E8B868" />
          {/* Muzzle */}
          <ellipse cx="100" cy="104" rx="22" ry="16" fill="#FFF8DC" />
          <polygon points="94,96 106,96 100,103" fill="#3D2012" />

          {/* Focused Glowing Eyes */}
          <ellipse cx="84" cy="85" rx="6" ry="7" fill="#0A84FF" />
          <circle cx="85" cy="83" r="2.5" fill="#FFFFFF" />
          <ellipse cx="116" cy="85" rx="6" ry="7" fill="#0A84FF" />
          <circle cx="117" cy="83" r="2.5" fill="#FFFFFF" />

          {/* Grand Crown */}
          <polygon
            points="70,45 80,15 92,35 100,8 108,35 120,15 130,45"
            fill="url(#goldMane)"
            stroke="#FFF1A8"
            strokeWidth="2"
          />
          <circle cx="100" cy="24" r="4" fill="#FF3B30" />
          <circle cx="80" cy="28" r="3" fill="#0A84FF" />
          <circle cx="120" cy="28" r="3" fill="#30D158" />
        </svg>
      </div>

      {/* Mascot Name Banner & Crown Badge */}
      <div className="mascot-badge-tag">
        <span className="mascot-crown-icon">👑</span>
        <span className="mascot-title-text">{name}</span>
      </div>
    </div>
  );
}
