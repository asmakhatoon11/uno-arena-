import React from 'react';
import { Home, Users, Palette, User } from 'lucide-react';
import { audioService } from '../services/audioService';

export default function BottomNavBar({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'HOME', label: 'HOME', icon: Home },
    { id: 'FRIENDS', label: 'FRIENDS', icon: Users },
    { id: 'COLLECTION', label: 'COLLECTION', icon: Palette },
    { id: 'PROFILE', label: 'PROFILE', icon: User }
  ];

  const handleTabClick = (tabId) => {
    audioService.playButtonClick();
    onSelectTab(tabId);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '10px 12px 14px 12px',
        background: 'linear-gradient(0deg, rgba(8, 7, 13, 0.98) 0%, rgba(20, 16, 31, 0.95) 100%)',
        borderTop: '1px solid rgba(212, 175, 55, 0.25)',
        zIndex: 50
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              color: isActive ? 'var(--gold-light)' : 'var(--text-muted)',
              transition: 'all 0.15s ease'
            }}
          >
            <div
              style={{
                padding: '4px 14px',
                borderRadius: '16px',
                background: isActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: isActive ? 800 : 600,
                letterSpacing: '0.5px'
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
