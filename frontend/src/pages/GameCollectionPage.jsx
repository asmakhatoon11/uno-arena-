import React, { useState } from 'react';
import { ARENAS, CARD_THEMES, AVATARS } from '../utils/constants';
import EnvironmentLayer from '../components/EnvironmentLayer';
import { audioService } from '../services/audioService';

export default function GameCollectionPage({ profile, onUpdateProfile }) {
  const [tab, setTab] = useState('ARENAS'); // 'ARENAS', 'THEMES', 'AVATARS'

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
    <div className="collection-scene-container">
      <EnvironmentLayer arenaId={profile?.activeArena || 'ROYAL_PALACE'} />

      <div className="collection-content-body">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <div className="gold-text" style={{ fontSize: '1.8rem', letterSpacing: '1.5px', fontFamily: 'var(--font-title)' }}>
            ROYAL VAULT
          </div>
          <div style={{ fontSize: '0.75rem', color: '#FFF1A8', fontWeight: 800 }}>
            COLLECTIBLES & CUSTOMIZATION
          </div>
        </div>

        {/* 3D Tabs */}
        <div className="vault-tabs-row">
          {['ARENAS', 'THEMES', 'AVATARS'].map(t => (
            <button
              key={t}
              className={`vault-tab-btn ${tab === t ? 'active' : ''}`}
              onClick={() => {
                audioService.playButtonClick();
                setTab(t);
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content Showcase */}
        <div className="vault-showcase-grid">
          {/* Arenas */}
          {tab === 'ARENAS' && ARENAS.map(arena => {
            const isEquipped = (profile?.activeArena || 'ROYAL_PALACE') === arena.id;

            return (
              <div
                key={arena.id}
                className={`vault-item-card ${isEquipped ? 'equipped' : ''}`}
                style={{ background: arena.bg }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '2.4rem' }}>{arena.icon}</div>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#FFFFFF' }}>{arena.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.7)' }}>{arena.desc}</div>
                  </div>
                </div>

                <button
                  className={isEquipped ? 'game-btn-green' : 'game-btn-pill'}
                  style={{ padding: '6px 16px', fontSize: '0.78rem' }}
                  onClick={() => handleEquipArena(arena.id)}
                >
                  {isEquipped ? 'EQUIPPED' : 'SELECT'}
                </button>
              </div>
            );
          })}

          {/* Card Themes */}
          {tab === 'THEMES' && CARD_THEMES.map(theme => {
            const isEquipped = (profile?.activeTheme || 'royal_classic') === theme.id;

            return (
              <div
                key={theme.id}
                className={`vault-item-card ${isEquipped ? 'equipped' : ''}`}
              >
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1rem', color: '#FFFFFF' }}>{theme.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9284AD' }}>{theme.desc}</div>
                </div>

                <button
                  className={isEquipped ? 'game-btn-green' : 'game-btn-pill'}
                  style={{ padding: '6px 16px', fontSize: '0.78rem' }}
                  onClick={() => handleEquipTheme(theme.id)}
                >
                  {isEquipped ? 'EQUIPPED' : 'EQUIP'}
                </button>
              </div>
            );
          })}

          {/* Avatars */}
          {tab === 'AVATARS' && (
            <div className="vault-avatars-grid">
              {AVATARS.map(av => {
                const isEquipped = profile?.avatar === av.icon;

                return (
                  <div
                    key={av.id}
                    className={`vault-avatar-pod ${isEquipped ? 'equipped' : ''}`}
                    onClick={() => handleEquipAvatar(av.icon)}
                  >
                    <div style={{ fontSize: '2.5rem' }}>{av.icon}</div>
                    <div className="avatar-pod-label">{av.name}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
