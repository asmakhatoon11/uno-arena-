import React, { useState } from 'react';
import { Edit2, Check } from 'lucide-react';
import EnvironmentLayer from '../components/EnvironmentLayer';
import { audioService } from '../services/audioService';

export default function GameProfilePage({ profile, onUpdateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile?.name || 'Aurelius The Sovereign');

  const handleSave = () => {
    audioService.playButtonClick();
    if (nameInput.trim()) {
      onUpdateProfile({ name: nameInput.trim() });
    }
    setIsEditing(false);
  };

  const winRate = profile?.gamesPlayed > 0
    ? Math.round((profile.wins / profile.gamesPlayed) * 100)
    : 0;

  const achievements = [
    { title: 'Arena Initiate', desc: 'Fought your first match', icon: '⚔️' },
    { title: 'Royal Champion', desc: 'Won an arena showdown', icon: '🏆' },
    { title: 'Wild Conjurer', desc: 'Shifted destiny with a Wild', icon: '🌟' },
    { title: 'Thunder Shout', desc: 'Shouted UNO in combat', icon: '👑' }
  ];

  return (
    <div className="profile-scene-container">
      <EnvironmentLayer arenaId={profile?.activeArena || 'ROYAL_PALACE'} />

      <div className="profile-content-body">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div className="gold-text" style={{ fontSize: '1.8rem', fontFamily: 'var(--font-title)', letterSpacing: '1.5px' }}>
            SOVEREIGN CREST
          </div>
        </div>

        {/* Hero Identity Card */}
        <div className="profile-identity-card">
          <div className="profile-big-avatar">
            <span>{profile?.avatar || '🦁'}</span>
          </div>

          {/* Name & Pen */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={18}
                  className="profile-name-input"
                />
                <button className="game-btn-green" style={{ padding: '6px 12px' }} onClick={handleSave}>
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <>
                <span className="profile-hero-name">{profile?.name}</span>
                <button
                  className="game-btn-circle"
                  style={{ width: '32px', height: '32px' }}
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 size={14} />
                </button>
              </>
            )}
          </div>

          <div className="profile-level-tag">
            LEVEL {profile?.level || 1} SOVEREIGN
          </div>

          {/* Stats Pods Grid */}
          <div className="profile-stats-grid">
            <div className="profile-stat-pod">
              <span className="stat-num gold-text">{profile?.wins || 0}</span>
              <span className="stat-lbl">VICTORIES</span>
            </div>
            <div className="profile-stat-pod">
              <span className="stat-num">{profile?.gamesPlayed || 0}</span>
              <span className="stat-lbl">MATCHES</span>
            </div>
            <div className="profile-stat-pod">
              <span className="stat-num" style={{ color: '#30D158' }}>{winRate}%</span>
              <span className="stat-lbl">WIN RATE</span>
            </div>
          </div>
        </div>

        {/* Achievements Showcase */}
        <div className="profile-achievements-tray">
          <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#FFF1A8', marginBottom: '8px' }}>
            ROYAL HONORS & MEDALS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {achievements.map((ach, idx) => (
              <div key={idx} className="achievement-medal-card">
                <div style={{ fontSize: '1.8rem' }}>{ach.icon}</div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#FFFFFF' }}>{ach.title}</div>
                  <div style={{ fontSize: '0.7rem', color: '#9284AD' }}>{ach.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
