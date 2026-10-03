import React, { useState } from 'react';
import { UserPlus, Swords } from 'lucide-react';
import EnvironmentLayer from '../components/EnvironmentLayer';
import { audioService } from '../services/audioService';

export default function GameFriendsPage({ friends = [], onInviteFriend }) {
  const [friendList, setFriendList] = useState(friends);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [challengeSent, setChallengeSent] = useState({});

  const handleAddFriend = () => {
    if (!addName.trim()) return;
    audioService.playButtonClick();
    setFriendList(prev => [
      ...prev,
      {
        id: `f_${Date.now()}`,
        name: addName.trim(),
        avatar: '🦁',
        status: 'Online',
        level: Math.floor(Math.random() * 6) + 1
      }
    ]);
    setAddName('');
    setShowAddModal(false);
  };

  const handleChallenge = (friendId) => {
    audioService.playButtonClick();
    setChallengeSent(prev => ({ ...prev, [friendId]: true }));
    if (onInviteFriend) onInviteFriend(friendId);
    setTimeout(() => {
      setChallengeSent(prev => ({ ...prev, [friendId]: false }));
    }, 3000);
  };

  return (
    <div className="friends-scene-container">
      <EnvironmentLayer arenaId="ROYAL_PALACE" />

      <div className="friends-content-body">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div className="gold-text" style={{ fontSize: '1.8rem', fontFamily: 'var(--font-title)', letterSpacing: '1.5px' }}>
            ROYAL ALLIES
          </div>
          <div style={{ fontSize: '0.75rem', color: '#FFF1A8', fontWeight: 800 }}>
            COMRADES & CHALLENGERS
          </div>
        </div>

        {/* Add Friend Button */}
        <button
          className="game-btn-play"
          style={{ width: '100%', fontSize: '1rem', padding: '12px', marginBottom: '14px' }}
          onClick={() => {
            audioService.playButtonClick();
            setShowAddModal(true);
          }}
        >
          <UserPlus size={18} />
          <span>RECRUIT ALLY</span>
        </button>

        {/* Friends List */}
        <div className="friends-list-tray">
          {friendList.map(friend => {
            const isSent = challengeSent[friend.id];

            return (
              <div key={friend.id} className="friend-ally-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="friend-avatar-bubble">{friend.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '0.92rem', color: '#FFFFFF' }}>{friend.name}</div>
                    <div style={{ fontSize: '0.7rem', color: friend.status === 'Online' ? '#30D158' : '#FFD60A', fontWeight: 800 }}>
                      ● {friend.status} (Lvl {friend.level})
                    </div>
                  </div>
                </div>

                <button
                  className={isSent ? 'game-btn-pill' : 'game-btn-green'}
                  style={{ padding: '8px 14px', fontSize: '0.78rem' }}
                  onClick={() => handleChallenge(friend.id)}
                >
                  <Swords size={14} />
                  <span>{isSent ? 'CHALLENGED!' : 'CHALLENGE'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Add Friend Modal */}
        {showAddModal && (
          <div className="game-modal-overlay">
            <div className="game-modal-dialog">
              <div className="gold-text" style={{ fontSize: '1.25rem', fontFamily: 'var(--font-title)', marginBottom: '10px' }}>
                RECRUIT ALLY
              </div>
              <input
                type="text"
                placeholder="Enter ally name..."
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                className="profile-name-input"
                style={{ width: '100%', marginBottom: '14px' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="game-btn-red"
                  style={{ flex: 1 }}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="game-btn-green"
                  style={{ flex: 1 }}
                  onClick={handleAddFriend}
                >
                  Recruit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
