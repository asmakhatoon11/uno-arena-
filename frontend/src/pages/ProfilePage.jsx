import React, { useState } from 'react';
import { Trophy, Award, Flame, Star, Edit2, Check } from 'lucide-react';
import { audioService } from '../services/audioService';

export default function ProfilePage({ profile, onUpdateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile?.name || 'Royal Sovereign');

  const handleSaveName = () => {
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
    { title: 'Arena Novice', desc: 'Complete your first match', icon: '⚔️', unlocked: profile?.gamesPlayed > 0 },
    { title: 'Royal Victor', desc: 'Win your first arena match', icon: '🏆', unlocked: profile?.wins > 0 },
    { title: 'Wild Conjurer', desc: 'Play 5 wild cards in matches', icon: '🌟', unlocked: true },
    { title: 'Thunder Shout', desc: 'Successfully shout UNO 10 times', icon: '👑', unlocked: true }
  ];

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
          SOVEREIGN PROFILE
        </h2>
      </div>

      {/* Profile Card */}
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '380px',
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '1.5px solid var(--gold-primary)',
          marginBottom: '16px'
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--surface-royal-2)',
            border: '3px solid var(--gold-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.8rem',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)'
          }}
        >
          {profile?.avatar || '👑'}
        </div>

        {/* Username row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={18}
                style={{
                  background: 'rgba(13, 11, 22, 0.9)',
                  border: '1px solid var(--gold-primary)',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  outline: 'none'
                }}
              />
              <button
                onClick={handleSaveName}
                style={{
                  background: 'var(--gold-gradient)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  cursor: 'pointer'
                }}
              >
                <Check size={16} color="#120E1C" />
              </button>
            </div>
          ) : (
            <>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
                {profile?.name}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                style={{ background: 'none', border: 'none', color: 'var(--gold-light)', cursor: 'pointer' }}
              >
                <Edit2 size={15} />
              </button>
            </>
          )}
        </div>

        <div style={{ color: 'var(--gold-light)', fontSize: '0.8rem', fontWeight: 700, marginTop: '2px' }}>
          LEVEL {profile?.level || 1} SOVEREIGN
        </div>

        {/* XP Bar */}
        <div style={{ width: '80%', marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span>PROGRESS</span>
            <span>{profile?.xp || 0} / {profile?.xpNext || 300} XP</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '999px',
              overflow: 'hidden',
              marginTop: '4px',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}
          >
            <div
              style={{
                width: `${Math.min(100, ((profile?.xp || 0) / (profile?.xpNext || 300)) * 100)}%`,
                height: '100%',
                background: 'var(--gold-gradient)'
              }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            width: '100%',
            marginTop: '18px'
          }}
        >
          <div
            style={{
              background: 'rgba(13, 11, 22, 0.7)',
              borderRadius: '12px',
              padding: '10px 4px',
              textAlign: 'center',
              border: '1px solid rgba(212, 175, 55, 0.2)'
            }}
          >
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--gold-light)' }}>
              {profile?.wins || 0}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              VICTORIES
            </div>
          </div>

          <div
            style={{
              background: 'rgba(13, 11, 22, 0.7)',
              borderRadius: '12px',
              padding: '10px 4px',
              textAlign: 'center',
              border: '1px solid rgba(212, 175, 55, 0.2)'
            }}
          >
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF' }}>
              {profile?.gamesPlayed || 0}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              MATCHES
            </div>
          </div>

          <div
            style={{
              background: 'rgba(13, 11, 22, 0.7)',
              borderRadius: '12px',
              padding: '10px 4px',
              textAlign: 'center',
              border: '1px solid rgba(212, 175, 55, 0.2)'
            }}
          >
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#30D158' }}>
              {winRate}%
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              WIN RATE
            </div>
          </div>
        </div>
      </div>

      {/* Achievements List */}
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--gold-light)', marginBottom: '8px' }}>
          ROYAL ACHIEVEMENTS
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                opacity: ach.unlocked ? 1 : 0.6
              }}
            >
              <div style={{ fontSize: '1.6rem' }}>{ach.icon}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#FFFFFF' }}>
                  {ach.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {ach.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
