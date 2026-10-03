import React, { useState } from 'react';
import { Copy, Plus, Play, ArrowLeft } from 'lucide-react';
import { audioService } from '../services/audioService';

export default function PrivateRoomModal({
  isOpen,
  onClose,
  onStartGame,
  playerProfile
}) {
  const [tab, setTab] = useState('CREATE'); // 'CREATE' or 'JOIN'
  const [roomCode, setRoomCode] = useState(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  });
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [slots, setSlots] = useState([
    { name: playerProfile?.name || 'Host (You)', avatar: playerProfile?.avatar || '👑', isHost: true },
    { name: 'Open Slot', avatar: '➕', isOpen: true },
    { name: 'Open Slot', avatar: '➕', isOpen: true },
    { name: 'Open Slot', avatar: '➕', isOpen: true }
  ]);

  if (!isOpen) return null;

  const handleCopy = () => {
    audioService.playButtonClick();
    navigator.clipboard?.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddBot = () => {
    audioService.playButtonClick();
    const openIdx = slots.findIndex(s => s.isOpen);
    if (openIdx !== -1) {
      const botPool = [
        { name: 'Lord Aiden', avatar: '🦁' },
        { name: 'Duchess Vesper', avatar: '⚔️' },
        { name: 'Archmage Zephyr', avatar: '💎' }
      ];
      const bot = botPool[openIdx - 1] || { name: 'Royal Guard', avatar: '🛡️' };
      const updated = [...slots];
      updated[openIdx] = { ...bot, isBot: true };
      setSlots(updated);
    }
  };

  const handleStart = () => {
    audioService.playButtonClick();
    audioService.playTurn();
    onStartGame({ roomCode, slots: slots.filter(s => !s.isOpen) });
  };

  const handleJoinSubmit = () => {
    if (!inputCode.trim()) return;
    audioService.playButtonClick();
    audioService.playTurn();
    onStartGame({ roomCode: inputCode.toUpperCase().trim(), slots: [] });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(8, 7, 13, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 200,
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
          maxWidth: '380px',
          padding: '24px 20px',
          border: '2px solid var(--gold-primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {/* Header with Back button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--gold-light)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ArrowLeft size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Back</span>
          </button>
          <span className="gold-text" style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>
            PLAY WITH FRIENDS
          </span>
          <div style={{ width: '40px' }} />
        </div>

        {/* Tab Toggle: CREATE vs JOIN */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(13, 11, 22, 0.7)',
            borderRadius: '12px',
            padding: '4px',
            border: '1px solid rgba(212, 175, 55, 0.3)'
          }}
        >
          <button
            onClick={() => {
              audioService.playButtonClick();
              setTab('CREATE');
            }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: tab === 'CREATE' ? 'var(--gold-gradient)' : 'transparent',
              color: tab === 'CREATE' ? '#120E1C' : 'var(--text-light)',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            CREATE ROOM
          </button>
          <button
            onClick={() => {
              audioService.playButtonClick();
              setTab('JOIN');
            }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: tab === 'JOIN' ? 'var(--gold-gradient)' : 'transparent',
              color: tab === 'JOIN' ? '#120E1C' : 'var(--text-light)',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            JOIN ROOM
          </button>
        </div>

        {tab === 'CREATE' ? (
          <>
            {/* Room Code Display */}
            <div
              style={{
                textAlign: 'center',
                background: 'rgba(13, 11, 22, 0.9)',
                padding: '12px',
                borderRadius: '14px',
                border: '1px solid var(--gold-light)'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                ROOM CODE (SHARE WITH FRIENDS)
              </div>
              <div
                style={{
                  fontSize: '2rem',
                  fontFamily: 'var(--font-royal)',
                  fontWeight: 900,
                  color: '#FFF1A8',
                  letterSpacing: '4px',
                  margin: '4px 0'
                }}
              >
                {roomCode}
              </div>
              <button
                onClick={handleCopy}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copied ? '#30D158' : 'var(--gold-light)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Copy size={14} />
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Player Slots */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {slots.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '10px 4px',
                    borderRadius: '10px',
                    background: s.isOpen ? 'rgba(255, 255, 255, 0.05)' : 'rgba(36, 26, 53, 0.9)',
                    border: s.isOpen ? '1px dashed rgba(255, 255, 255, 0.2)' : '1px solid var(--gold-primary)'
                  }}
                >
                  <div style={{ fontSize: '1.4rem' }}>{s.avatar}</div>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: s.isOpen ? 'var(--text-muted)' : '#FFFFFF',
                      marginTop: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '60px'
                    }}
                  >
                    {s.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Host Controls */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn-royal-glass"
                onClick={handleAddBot}
                style={{ flex: 1, fontSize: '0.85rem', padding: '10px' }}
                disabled={!slots.some(s => s.isOpen)}
              >
                <Plus size={16} /> Add Bot
              </button>
              <button
                className="btn-royal"
                onClick={handleStart}
                style={{ flex: 1.5, fontSize: '0.95rem', padding: '10px' }}
              >
                <Play size={18} fill="#120E1C" /> START MATCH
              </button>
            </div>
          </>
        ) : (
          /* Join Room View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '10px 0' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                ENTER 6-CHARACTER ROOM CODE
              </label>
              <input
                type="text"
                placeholder="e.g. ROYAL8"
                maxLength={6}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'rgba(13, 11, 22, 0.8)',
                  border: '1px solid var(--gold-primary)',
                  color: '#FFF1A8',
                  fontSize: '1.4rem',
                  fontFamily: 'var(--font-royal)',
                  fontWeight: 900,
                  letterSpacing: '4px',
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
            </div>
            <button
              className="btn-royal"
              onClick={handleJoinSubmit}
              disabled={inputCode.length < 4}
              style={{ width: '100%', marginTop: '6px' }}
            >
              ENTER ROOM ⚔️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
