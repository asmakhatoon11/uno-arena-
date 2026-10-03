import React, { useState } from 'react';
import { ARENAS, CARD_THEMES, AVATARS } from '../utils/constants';
import { audioService } from '../services/audioService';

export default function CollectionPage({ profile, onUpdateProfile }) {
  const [activeCategory, setActiveCategory] = useState('ARENAS'); // 'ARENAS', 'THEMES', 'AVATARS'

  const handleEquipArena = (arenaId) => {
    audioService.playButtonClick();
    onUpdateProfile({ activeArena: arenaId });
  };

  const handleEquipTheme = (themeId) => {
    audioService.playButtonClick();
    onUpdateProfile({ activeTheme: themeId });
  };

  const handleEquipAvatar = (icon) => {
    audioService.playButtonClick();
    onUpdateProfile({ avatar: icon });
  };

  return (
    <div
      style={{
        flex: 1,
        padding: '16px 20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '14px' }}>
        <h2 className="gold-text" style={{ fontSize: '1.8rem', letterSpacing: '1px' }}>
          ROYAL VAULT
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Customize your arena table, cards and sovereign crest
        </p>
      </div>

      {/* Category Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          width: '100%',
          maxWidth: '380px',
          marginBottom: '16px'
        }}
      >
        {['ARENAS', 'THEMES', 'AVATARS'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              audioService.playButtonClick();
              setActiveCategory(cat);
            }}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: '12px',
              border: activeCategory === cat ? '1px solid var(--gold-light)' : '1px solid rgba(212, 175, 55, 0.2)',
              background: activeCategory === cat ? 'var(--gold-gradient)' : 'rgba(36, 26, 53, 0.7)',
              color: activeCategory === cat ? '#120E1C' : 'var(--text-light)',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          paddingBottom: '20px'
        }}
      >
        {/* Arenas Category */}
        {activeCategory === 'ARENAS' &&
          ARENAS.map((arena) => {
            const isEquipped = (profile?.activeArena || 'ROYAL_PALACE') === arena.id;

            return (
              <div
                key={arena.id}
                className="glass-panel"
                style={{
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: isEquipped ? '2px solid var(--gold-primary)' : '1px solid rgba(212, 175, 55, 0.25)',
                  background: arena.bg
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '2rem' }}>{arena.icon}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFFFFF' }}>
                      {arena.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                      {arena.desc}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleEquipArena(arena.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '14px',
                    border: 'none',
                    background: isEquipped ? '#30D158' : 'rgba(212, 175, 55, 0.85)',
                    color: isEquipped ? '#FFFFFF' : '#120E1C',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  {isEquipped ? 'EQUIPPED' : 'EQUIP'}
                </button>
              </div>
            );
          })}

        {/* Card Themes Category */}
        {activeCategory === 'THEMES' &&
          CARD_THEMES.map((theme) => {
            const isEquipped = (profile?.activeTheme || 'royal_classic') === theme.id;

            return (
              <div
                key={theme.id}
                className="glass-panel"
                style={{
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: isEquipped ? '2px solid var(--gold-primary)' : '1px solid rgba(212, 175, 55, 0.25)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFFFFF' }}>
                    {theme.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {theme.desc}
                  </div>
                </div>

                <button
                  onClick={() => handleEquipTheme(theme.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '14px',
                    border: 'none',
                    background: isEquipped ? '#30D158' : 'var(--gold-gradient)',
                    color: isEquipped ? '#FFFFFF' : '#120E1C',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  {isEquipped ? 'EQUIPPED' : 'EQUIP'}
                </button>
              </div>
            );
          })}

        {/* Avatars Category */}
        {activeCategory === 'AVATARS' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px'
            }}
          >
            {AVATARS.map((av) => {
              const isEquipped = profile?.avatar === av.icon;

              return (
                <div
                  key={av.id}
                  onClick={() => handleEquipAvatar(av.icon)}
                  style={{
                    padding: '14px 8px',
                    borderRadius: '14px',
                    background: isEquipped ? 'rgba(212, 175, 55, 0.2)' : 'rgba(36, 26, 53, 0.7)',
                    border: isEquipped ? '2px solid var(--gold-light)' : '1px solid rgba(212, 175, 55, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '2.2rem' }}>{av.icon}</div>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: isEquipped ? 'var(--gold-light)' : 'var(--text-muted)',
                      marginTop: '6px',
                      textAlign: 'center'
                    }}
                  >
                    {av.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
