import React, { useState, useEffect } from 'react';
import SplashScreen from './pages/SplashScreen';
import WelcomeScreen from './pages/WelcomeScreen';
import GameLobbyPage from './pages/GameLobbyPage';
import MatchmakingScreen from './pages/MatchmakingScreen';
import GameArenaPage from './pages/GameArenaPage';
import InteractiveTutorialPage from './pages/InteractiveTutorialPage';
import ResultScreen from './pages/ResultScreen';
import GameCollectionPage from './pages/GameCollectionPage';
import GameProfilePage from './pages/GameProfilePage';
import GameFriendsPage from './pages/GameFriendsPage';
import SettingsModal from './pages/SettingsModal';
import PrivateRoomModal from './pages/PrivateRoomModal';
import GameHUD from './components/GameHUD';
import GameBottomDock from './components/GameBottomDock';
import GameErrorBoundary from './components/GameErrorBoundary';
import HowToPlayModal from './components/HowToPlayModal';
import { LocalGameEngine } from './game/localEngine';
import { storageService } from './services/storageService';
import { audioService } from './services/audioService';
import { GAME_MODES } from './utils/constants';

export default function App() {
  const [page, setPage] = useState('SPLASH'); // 'SPLASH', 'WELCOME', 'HOME', 'MATCHMAKING', 'ARENA', 'TUTORIAL', 'RESULT'
  const [bottomTab, setBottomTab] = useState('HOME'); // 'HOME', 'FRIENDS', 'COLLECTION', 'PROFILE'
  const [profile, setProfile] = useState(() => storageService.getProfile());
  const [settings, setSettings] = useState(() => storageService.getProfile().settings);
  const [activeEngine, setActiveEngine] = useState(null);
  const [matchResult, setMatchResult] = useState(null);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  // Check first-time onboarding tutorial
  useEffect(() => {
    if (page === 'HOME') {
      const hasCompleted = localStorage.getItem('uno_tutorial_completed');
      if (!hasCompleted) {
        setIsHowToPlayOpen(true);
      }
    }
  }, [page]);

  // Device simulation preview mode toggle (defaults to fullscreen on desktop viewports)
  const [deviceMode, setDeviceMode] = useState(() => {
    if (typeof window === 'undefined') return 'fullscreen';
    const isTouch = navigator.maxTouchPoints > 0;
    const isSmallTouch = isTouch && (window.innerWidth <= 900 || window.innerHeight <= 900);
    return isSmallTouch ? 'phone' : 'fullscreen';
  });

  useEffect(() => {
    // Sync audio and voice settings on launch
    audioService.setSfxEnabled(settings.sfxEnabled);
    audioService.setMusicEnabled(settings.musicEnabled);
    audioService.setVolume(settings.volume);
    audioService.setVoiceEnabled(settings.voiceEnabled ?? true);
    audioService.setVoiceVolume(settings.voiceVolume ?? 0.8);
  }, []);

  useEffect(() => {
    // Sync theme to document root
    const activeTheme = settings.theme || 'dark';
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [settings.theme]);

  const handleUpdateProfile = (updates) => {
    const updated = storageService.updateProfile(updates);
    setProfile(updated);
  };

  const handleUpdateSettings = (updates) => {
    const updated = storageService.updateSettings(updates);
    setSettings(updated);
    if ('sfxEnabled' in updates) audioService.setSfxEnabled(updates.sfxEnabled);
    if ('musicEnabled' in updates) audioService.setMusicEnabled(updates.musicEnabled);
    if ('volume' in updates) audioService.setVolume(updates.volume);
    if ('voiceEnabled' in updates) audioService.setVoiceEnabled(updates.voiceEnabled);
    if ('voiceVolume' in updates) audioService.setVoiceVolume(updates.voiceVolume);
  };

  const handleToggleSound = () => {
    const newMuted = !soundMuted;
    setSoundMuted(newMuted);
    audioService.setSfxEnabled(!newMuted);
  };

  // Launch Game Arena Match
  const launchMatch = (botCount = 3) => {
    try { audioService.unlock?.(); } catch {}
    const engine = new LocalGameEngine(
      {
        id: profile.id,
        name: profile.name,
        avatar: profile.avatar
      },
      botCount
    );
    setActiveEngine(engine);
    setPage('ARENA');
  };

  const handleSelectMode = (mode) => {
    if (mode === GAME_MODES.QUICK_MATCH) {
      setPage('MATCHMAKING');
    } else if (mode === GAME_MODES.CLASSIC) {
      launchMatch(3);
    } else if (mode === GAME_MODES.PRACTICE) {
      launchMatch(3);
    } else if (mode === GAME_MODES.FRIENDS) {
      setIsRoomModalOpen(true);
    } else if (mode === GAME_MODES.TUTORIAL) {
      setPage('TUTORIAL');
    }
  };

  const handleMatchComplete = (resultData) => {
    const coins = resultData.rewards?.coins || 160;
    const xp = resultData.rewards?.xp || 220;
    const isWinner = resultData.isWinner;

    const updatedProfile = storageService.addRewards(coins, xp, isWinner);
    setProfile(updatedProfile);
    setMatchResult(resultData);
    setPage('RESULT');
  };

  const handleTutorialComplete = (rewards) => {
    const updatedProfile = storageService.addRewards(rewards.coins || 350, rewards.xp || 500, true);
    setProfile(updatedProfile);
    setMatchResult({
      isWinner: true,
      winner: { name: profile.name, avatar: profile.avatar },
      rewards
    });
    setPage('RESULT');
  };

  return (
    <div className="game-viewport">
      {/* Device Mode Switcher Floating Pill */}
      <button
        className="device-toggle-pill"
        onClick={() => setDeviceMode(prev => prev === 'phone' ? 'fullscreen' : 'phone')}
        title="Toggle Mobile Simulator vs Fullscreen"
      >
        {deviceMode === 'phone' ? '📱 Mobile Frame (390×844)' : '🖥️ Desktop Fullscreen'}
      </button>

      {/* Master Mobile Game Stage */}
      <div className={`game-stage ${deviceMode === 'phone' ? 'framed' : 'fullscreen desktop'}`}>
        {/* 1. Splash Screen */}
        {page === 'SPLASH' && (
          <SplashScreen
            onComplete={() => {
              setPage('WELCOME');
            }}
          />
        )}

        {/* 2. Welcome Screen */}
        {page === 'WELCOME' && (
          <WelcomeScreen
            profile={profile}
            onContinue={({ name, avatar }) => {
              try { audioService.unlock?.(); } catch {}
              handleUpdateProfile({ name, avatar });
              setPage('HOME');
            }}
          />
        )}

        {/* 3. Main Lobby & Dock Tabs */}
        {page === 'HOME' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', position: 'relative' }}>
            <GameHUD
              profile={profile}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenProfile={() => setBottomTab('PROFILE')}
              onToggleSound={handleToggleSound}
              onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
              soundMuted={soundMuted}
            />

            {bottomTab === 'HOME' && (
              <GameLobbyPage
                profile={profile}
                onSelectMode={handleSelectMode}
                onUpdateProfile={handleUpdateProfile}
              />
            )}

            {bottomTab === 'COLLECTION' && (
              <GameCollectionPage
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
              />
            )}

            {bottomTab === 'PROFILE' && (
              <GameProfilePage
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
              />
            )}

            {bottomTab === 'FRIENDS' && (
              <GameFriendsPage
                friends={profile.friends}
                onInviteFriend={() => setIsRoomModalOpen(true)}
              />
            )}

            <GameBottomDock
              activeTab={bottomTab}
              onSelectTab={setBottomTab}
            />
          </div>
        )}

        {/* 4. Matchmaking Cinematic Scene */}
        {page === 'MATCHMAKING' && (
          <MatchmakingScreen
            playerProfile={profile}
            onCancel={() => setPage('HOME')}
            onMatchFound={() => {
              launchMatch(3);
            }}
          />
        )}

        {/* 5. Main Game Arena (Dominating Table) */}
        {page === 'ARENA' && activeEngine && (
          <GameErrorBoundary onReset={() => setPage('HOME')}>
            <GameArenaPage
              engine={activeEngine}
              playerProfile={profile}
              onExit={() => setPage('HOME')}
              onMatchComplete={handleMatchComplete}
              onUpdateProfile={handleUpdateProfile}
              currentTheme={settings.theme || 'dark'}
              onUpdateSettings={handleUpdateSettings}
            />
          </GameErrorBoundary>
        )}

        {/* 6. Interactive Training Academy */}
        {page === 'TUTORIAL' && (
          <InteractiveTutorialPage
            onExit={() => setPage('HOME')}
            onComplete={handleTutorialComplete}
          />
        )}

        {/* 7. Result Screen */}
        {page === 'RESULT' && (
          <ResultScreen
            resultData={matchResult}
            onPlayAgain={() => launchMatch(3)}
            onGoHome={() => setPage('HOME')}
          />
        )}

        {/* Modals */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          profile={profile}
        />

        <PrivateRoomModal
          isOpen={isRoomModalOpen}
          onClose={() => setIsRoomModalOpen(false)}
          onStartGame={() => {
            setIsRoomModalOpen(false);
            launchMatch(3);
          }}
          playerProfile={profile}
        />

        <HowToPlayModal
          isOpen={isHowToPlayOpen}
          onClose={() => setIsHowToPlayOpen(false)}
          onStartGame={() => {
            setIsHowToPlayOpen(false);
            launchMatch(3);
          }}
        />
      </div>
    </div>
  );
}
