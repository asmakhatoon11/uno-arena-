import React from 'react';
import { Home, Users, Palette, User } from 'lucide-react';
import { audioService } from '../services/audioService';

export default function GameBottomDock({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'HOME', label: 'LOBBY', icon: Home },
    { id: 'FRIENDS', label: 'ALLIES', icon: Users },
    { id: 'COLLECTION', label: 'VAULT', icon: Palette },
    { id: 'PROFILE', label: 'PROFILE', icon: User }
  ];

  const handleTabClick = (tabId) => {
    audioService.playButtonClick();
    onSelectTab(tabId);
  };

  return (
    <div className="game-bottom-dock">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            className={`dock-tab ${isActive ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            <div className="dock-icon-wrapper">
              <Icon size={22} strokeWidth={isActive ? 2.8 : 2} />
            </div>
            <span className="dock-tab-label">
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
