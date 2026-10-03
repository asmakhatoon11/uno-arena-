import React, { useState } from 'react';
import { UserPlus, Send, MessageCircle } from 'lucide-react';
import { audioService } from '../services/audioService';

export default function FriendsPage({ friends = [], onInviteFriend }) {
  const [activeTab, setActiveTab] = useState('FRIENDS'); // 'FRIENDS', 'REQUESTS', 'RECENT'
  const [friendList, setFriendList] = useState(friends);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [inviteSent, setInviteSent] = useState({});

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
        level: Math.floor(Math.random() * 8) + 1
      }
    ]);
    setAddName('');
    setShowAddModal(false);
  };

  const handleInvite = (friendId) => {
    audioService.playButtonClick();
    setInviteSent(prev => ({ ...prev, [friendId]: true }));
    if (onInviteFriend) onInviteFriend(friendId);
    setTimeout(() => {
      setInviteSent(prev => ({ ...prev, [friendId]: false }));
    }, 3000);
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
          ROYAL ALLIES
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Challenge companions and fellow champions
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          width: '100%',
          maxWidth: '380px',
          marginBottom: '16px'
        }}
      >
        {['FRIENDS', 'REQUESTS', 'RECENT'].map(tab => (
          <button
            key={tab}
            onClick={() => {
              audioService.playButtonClick();
              setActiveTab(tab);
            }}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: '12px',
              border: activeTab === tab ? '1px solid var(--gold-light)' : '1px solid rgba(212, 175, 55, 0.2)',
              background: activeTab === tab ? 'var(--gold-gradient)' : 'rgba(36, 26, 53, 0.7)',
              color: activeTab === tab ? '#120E1C' : 'var(--text-light)',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Action Add Friend Button */}
      <div style={{ width: '100%', maxWidth: '380px', marginBottom: '14px' }}>
        <button
          className="btn-royal"
          onClick={() => {
            audioService.playButtonClick();
            setShowAddModal(true);
          }}
          style={{ width: '100%', fontSize: '0.9rem', padding: '12px' }}
        >
          <UserPlus size={18} />
          <span>ADD NEW ALLY</span>
        </button>
      </div>

      {/* Friend List */}
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {friendList.map(friend => {
          const isInvited = inviteSent[friend.id];

          return (
            <div
              key={friend.id}
              className="glass-panel"
              style={{
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'var(--surface-royal-2)',
                    border: '1.5px solid var(--gold-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}
                >
                  {friend.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#FFFFFF' }}>
                    {friend.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: friend.status === 'Online' ? '#30D158' : friend.status === 'In Match' ? '#FFD60A' : 'var(--text-muted)'
                    }}
                  >
                    ● {friend.status} (Lvl {friend.level})
                  </div>
                </div>
              </div>

              <button
                className="btn-royal-glass"
                onClick={() => handleInvite(friend.id)}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.75rem',
                  border: isInvited ? '1px solid #30D158' : undefined,
                  color: isInvited ? '#30D158' : undefined
                }}
              >
                {isInvited ? 'INVITED!' : 'INVITE'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Friend Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(8, 7, 13, 0.8)',
            backdropFilter: 'blur(6px)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '320px',
              padding: '20px',
              border: '1.5px solid var(--gold-light)'
            }}
          >
            <h3 className="gold-text" style={{ fontSize: '1.2rem', marginBottom: '12px' }}>
              ADD ALLY
            </h3>
            <input
              type="text"
              placeholder="Enter player nickname..."
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(13, 11, 22, 0.9)',
                border: '1px solid var(--gold-primary)',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                outline: 'none',
                marginBottom: '14px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn-royal-glass"
                onClick={() => setShowAddModal(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                className="btn-royal"
                onClick={handleAddFriend}
                style={{ flex: 1 }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
