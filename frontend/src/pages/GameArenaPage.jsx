import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, MessageSquare, Volume2, VolumeX, Music, Sun, Moon, X, HelpCircle } from 'lucide-react';
import GameTable from '../components/GameTable';
import GameCard from '../components/GameCard';
import GamePlayerSeat from '../components/GamePlayerSeat';
import EnvironmentLayer from '../components/EnvironmentLayer';
import ColorPickerModal from '../components/ColorPickerModal';
import ReactionPicker from '../components/ReactionPicker';
import CinematicMatchStart from '../components/CinematicMatchStart';
import SpecialEffectsOverlay from '../components/SpecialEffectsOverlay';
import CardHand from '../components/CardHand';
import GameErrorBoundary from '../components/GameErrorBoundary';
import HowToPlayModal from '../components/HowToPlayModal';
import { audioService } from '../services/audioService';
import { CARD_TYPES, COLORS, ARENAS } from '../utils/constants';

export default function GameArenaPage({
  engine,
  onExit,
  onMatchComplete,
  playerProfile,
  onUpdateProfile,
  currentTheme = 'dark',
  onUpdateSettings
}) {
  const [gameState, setGameState] = useState(() =>
    engine.getState(playerProfile?.id || engine.players?.[0]?.id)
  );

  const [turnTimeLeft, setTurnTimeLeft] = useState(15);
  const [pendingWildCard, setPendingWildCard] = useState(null);
  const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false);
  const [activeReactions, setActiveReactions] = useState({});
  const [playerEmotions, setPlayerEmotions] = useState({});
  const [vfxEffect, setVfxEffect] = useState(null);
  const [showYourTurnBanner, setShowYourTurnBanner] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [musicMuted, setMusicMuted] = useState(() => !audioService.musicEnabled);
  const [discardBounce, setDiscardBounce] = useState(false);
  const [isMatchIntroActive, setIsMatchIntroActive] = useState(true);
  const [flyingCard, setFlyingCard] = useState(null);

  // How to Play Guide Modal
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  // Extra Card & Penalty Feedback Badges (+2, +4, CAUGHT)
  const [penaltyBadges, setPenaltyBadges] = useState({});

  // Mobile Landscape Detection & Prompt
  const [isPortrait, setIsPortrait] = useState(() => (
    typeof window !== 'undefined'
      ? window.innerHeight > window.innerWidth && window.innerWidth < 650
      : false
  ));

  const [isMobileLandscape, setIsMobileLandscape] = useState(() => (
    typeof window !== 'undefined'
      ? window.innerWidth > window.innerHeight &&
        (navigator.maxTouchPoints > 0 || window.innerHeight <= 520)
      : false
  ));

  const [dismissLandscapePrompt, setDismissLandscapePrompt] = useState(false);

  // Dynamic In-Game Arena & Theme Switching
  const [activeArena, setActiveArena] = useState(() =>
    playerProfile?.activeArena || 'ROYAL_PALACE'
  );

  const [gameTheme, setGameTheme] = useState(() =>
    currentTheme || 'dark'
  );

  const [isArenaPickerOpen, setIsArenaPickerOpen] = useState(false);

  // Player Join Animation & Badge Tracking
  const prevPlayerIdsRef = useRef(
    new Set(gameState.players.map(p => p.id))
  );

  const [newJoinedPlayerIds, setNewJoinedPlayerIds] = useState(new Set());

  useEffect(() => {
    if (playerProfile?.activeArena) {
      setActiveArena(playerProfile.activeArena);
    }
  }, [playerProfile?.activeArena]);

  useEffect(() => {
    if (currentTheme) {
      setGameTheme(currentTheme);
    }
  }, [currentTheme]);

  const handleSelectArena = (arenaId) => {
    try {
      audioService.playButtonClick?.();
    } catch {}

    setActiveArena(arenaId || 'ROYAL_PALACE');
    setIsArenaPickerOpen(false);

    onUpdateProfile?.({
      activeArena: arenaId || 'ROYAL_PALACE'
    });
  };

  const handleToggleTheme = () => {
    try {
      audioService.playButtonClick?.();
    } catch {}

    const nextTheme = gameTheme === 'dark' ? 'light' : 'dark';

    setGameTheme(nextTheme);

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', nextTheme);
    }

    onUpdateSettings?.({
      theme: nextTheme
    });
  };

  const currentArenaMeta =
    ARENAS.find(a => a.id === activeArena) ||
    ARENAS[0] ||
    {
      name: 'Royal Palace',
      icon: '👑',
      id: 'ROYAL_PALACE'
    };

  const localPlayerId =
    playerProfile?.id ||
    engine.players?.[0]?.id ||
    null;

  const isMyTurn =
    gameState.currentTurnPlayerId === localPlayerId;

  const localPlayer =
    gameState.players.find(p => p.id === localPlayerId);

  const handleToggleMusic = () => {
    try {
      audioService.playButtonClick?.();
    } catch {}

    const nextMuted = !musicMuted;

    setMusicMuted(nextMuted);
    audioService.setMusicEnabled(!nextMuted);

    onUpdateSettings?.({
      musicEnabled: !nextMuted
    });
  };

  // Unlock audio on initial arena mount
  useEffect(() => {
    try {
      audioService.unlock?.();
    } catch {}
  }, []);

  // Track newly joined players
  useEffect(() => {
    const currentIds = new Set(
      gameState.players.map(p => p.id)
    );

    const newlyAdded = [];

    currentIds.forEach(id => {
      if (
        !prevPlayerIdsRef.current.has(id) &&
        id !== localPlayerId
      ) {
        newlyAdded.push(id);
      }
    });

    if (newlyAdded.length > 0) {
      setNewJoinedPlayerIds(
        prev => new Set([...prev, ...newlyAdded])
      );

      try {
        audioService.playTurn?.();
      } catch {}

      setTimeout(() => {
        setNewJoinedPlayerIds(prev => {
          const next = new Set(prev);

          newlyAdded.forEach(id => {
            next.delete(id);
          });

          return next;
        });
      }, 2400);
    }

    prevPlayerIdsRef.current = currentIds;
  }, [gameState.players, localPlayerId]);

  // Orientation listener
  useEffect(() => {
    const handleOrientation = () => {
      if (typeof window !== 'undefined') {
        setIsPortrait(
          window.innerHeight > window.innerWidth &&
          window.innerWidth < 650
        );

        setIsMobileLandscape(
          window.innerWidth > window.innerHeight &&
          window.innerHeight <= 520
        );
      }
    };

    handleOrientation();

    window.addEventListener('resize', handleOrientation);
    window.addEventListener('orientationchange', handleOrientation);

    return () => {
      window.removeEventListener('resize', handleOrientation);
      window.removeEventListener('orientationchange', handleOrientation);
    };
  }, []);

  // Set ambient procedural audio scene
  useEffect(() => {
    try {
      if (typeof audioService?.setScene === 'function') {
        audioService.setScene(activeArena || 'ROYAL_PALACE');
      }
    } catch (e) {
      console.warn('Audio setScene error (safe):', e);
    }

    return () => {
      try {
        if (typeof audioService?.setScene === 'function') {
          audioService.setScene('lobby');
        }
      } catch (e) {
        console.warn('Audio setScene error (safe):', e);
      }
    };
  }, [activeArena]);

  // Floating Penalty / Extra Card Badge Trigger
  const triggerPenaltyBadge = (
    playerId,
    text,
    type = 'draw'
  ) => {
    setPenaltyBadges(prev => ({
      ...prev,
      [playerId]: {
        text,
        type,
        id: Date.now()
      }
    }));

    try {
      if (type === 'draw4' || text.includes('4')) {
        audioService.playFrustrationPlus4?.();
      } else {
        audioService.playFrustrationPlus2?.();
      }
    } catch (err) {
      console.warn(
        'Penalty frustration audio error:',
        err
      );
    }

    setTimeout(() => {
      setPenaltyBadges(prev => {
        const copy = { ...prev };
        delete copy[playerId];
        return copy;
      });
    }, 2400);
  };

  // Turn Countdown Timer
  useEffect(() => {
    if (isMatchIntroActive) return;

    setTurnTimeLeft(15);

    const interval = setInterval(() => {
      setTurnTimeLeft(prev => {
        if (prev <= 1) {
          handleTurnTimeout();
          return 15;
        }

        const next = prev - 1;

        if (
          isMyTurn &&
          next <= 6 &&
          next >= 1
        ) {
          audioService.playTimerWarning(next);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    gameState.currentTurnPlayerId,
    isMatchIntroActive,
    isMyTurn
  ]);

  // "YOUR TURN" soft feedback
  useEffect(() => {
    if (isMatchIntroActive) return;

    if (
      isMyTurn &&
      gameState.status === 'IN_PROGRESS'
    ) {
      audioService.playTurn();

      setShowYourTurnBanner(true);

      const timer = setTimeout(
        () => setShowYourTurnBanner(false),
        1900
      );

      return () => clearTimeout(timer);
    }
  }, [
    gameState.currentTurnPlayerId,
    isMatchIntroActive
  ]);

  // Local state helper
  const updateState = () => {
    const newState = engine.getState(localPlayerId);

    setGameState(newState);

    if (
      newState.status === 'FINISHED' &&
      newState.winner
    ) {
      handleGameWin(newState.winner);
    }
  };

  // REAL-TIME SOCKET.IO STATE SUBSCRIPTION
  useEffect(() => {
    if (!engine || typeof engine.subscribe !== 'function') {
      return;
    }

    const unsubscribe = engine.subscribe((newState) => {
      setGameState(newState);

      if (
        newState.status === 'FINISHED' &&
        newState.winner
      ) {
        handleGameWin(newState.winner);
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, [engine]);

  const handleTurnTimeout = () => {
    if (!isMyTurn) return;

    /*
     * The multiplayer backend owns the authoritative turn timer.
     * We only perform a local fallback action here for the
     * current player. Do not directly manipulate remote players.
     */
    handleDrawCard();
  };

  const handleGameWin = (winner) => {
    const isLocalWin =
      winner.id === localPlayerId;

    if (isLocalWin) {
      audioService.playVictory();

      setPlayerEmotion(
        localPlayerId,
        'cheering',
        3000
      );

      try {
        confetti({
          particleCount: 140,
          spread: 85,
          origin: { y: 0.55 }
        });
      } catch {}
    } else {
      audioService.playDefeat();

      setPlayerEmotion(
        localPlayerId,
        'shocked',
        3000
      );
    }

    setTimeout(() => {
      onMatchComplete({
        isWinner: isLocalWin,
        winner,
        rewards: {
          coins: isLocalWin ? 160 : 40,
          xp: isLocalWin ? 220 : 70
        }
      });
    }, 2400);
  };

  const setPlayerEmotion = (
    playerId,
    emotion,
    duration = 1800
  ) => {
    setPlayerEmotions(prev => ({
      ...prev,
      [playerId]: emotion
    }));

    if (duration > 0) {
      setTimeout(() => {
        setPlayerEmotions(prev => ({
          ...prev,
          [playerId]: 'normal'
        }));
      }, duration);
    }
  };

  // Play a card
  const handlePlayCard = (card, event) => {
    if (!isMyTurn) return;

    if (
      card.type === CARD_TYPES.WILD ||
      card.type === CARD_TYPES.WILD_DRAW_FOUR
    ) {
      setPendingWildCard(card);
      return;
    }

    commitCardPlay(
      card.id,
      null,
      card
    );
  };

  const handleColorSelected = (chosenColor) => {
    if (!pendingWildCard) return;

    const card = pendingWildCard;

    setPendingWildCard(null);

    commitCardPlay(
      card.id,
      chosenColor,
      card
    );
  };

  const commitCardPlay = (
    cardId,
    chosenColor,
    card
  ) => {
    audioService.playWhoosh();

    setFlyingCard(card);

    setTimeout(() => {
      setFlyingCard(null);

      audioService.playCardSlam();

      setDiscardBounce(true);

      setTimeout(
        () => setDiscardBounce(false),
        300
      );

      const result = engine.playCard(
        localPlayerId,
        cardId,
        chosenColor
      );

      /*
       * SocketGameEngine returns a pending result because
       * the backend is authoritative. The actual state update
       * arrives through engine.subscribe().
       */
      if (result?.success) {
        const effects = result.effects || {};

        let targetName = null;

        if (effects.skippedPlayerId) {
          const targetPlayer =
            engine.players.find(
              p =>
                p.id ===
                effects.skippedPlayerId
            );

          targetName = targetPlayer?.name;

          setPlayerEmotion(
            effects.skippedPlayerId,
            'shocked',
            2400
          );

          triggerReaction(
            effects.skippedPlayerId,
            '😮',
            'Skipped?!'
          );
        }

        if (effects.drawnCardsPlayerId) {
          const targetPlayer =
            engine.players.find(
              p =>
                p.id ===
                effects.drawnCardsPlayerId
            );

          targetName = targetPlayer?.name;

          const count =
            effects.drawnCardsCount || 2;

          const isDraw4 = count >= 4;

          audioService.playDrawMultiple(
            count
          );

          setPlayerEmotion(
            effects.drawnCardsPlayerId,
            isDraw4
              ? 'shocked'
              : 'frustrated',
            2400
          );

          triggerReaction(
            effects.drawnCardsPlayerId,
            isDraw4 ? '😱' : '😤',
            `+${count} Cards?!`
          );

          triggerPenaltyBadge(
            effects.drawnCardsPlayerId,
            `+${count} CARDS!`,
            isDraw4
              ? 'draw4'
              : 'draw2'
          );
        }

        if (effects.directionReversed) {
          triggerReaction(
            localPlayerId,
            '🔄',
            'Reversed!'
          );
        }

        triggerVfx(
          card.type,
          localPlayer?.name,
          targetName
        );

        updateState();
      }
    }, 350);
  };

  // Draw Card
  const handleDrawCard = () => {
    if (!isMyTurn) return;

    audioService.playDrawCard();

    const result =
      engine.drawCard(localPlayerId);

    if (result?.success) {
      /*
       * Do NOT automatically pass here.
       *
       * In multiplayer, the server decides whether the
       * drawn card is playable. The SocketGameEngine will
       * receive the authoritative state through Socket.IO.
       *
       * The Pass button becomes available when the engine
       * marks that the player has drawn.
       */
      updateState();
    }
  };

  // Pass Turn
  const handlePassTurn = () => {
    if (!isMyTurn) return;

    audioService.playButtonClick();

    engine.passTurn(localPlayerId);

    updateState();
  };

  // Shout UNO
  const handleCallUno = () => {
    audioService.playUnoSuccess();

    const called =
      engine.callUno(localPlayerId);

    if (called) {
      triggerVfx(
        'UNO',
        localPlayer?.name
      );

      triggerReaction(
        localPlayerId,
        '👑',
        'UNO!'
      );

      updateState();
    }
  };

  // Catch Opponent UNO
  const handleCatchUno = (
    targetPlayerId
  ) => {
    audioService.playButtonClick();

    const caught =
      engine.catchUno(targetPlayerId);

    if (caught) {
      audioService.playUnoCaught();

      audioService.playDrawMultiple(2);

      setPlayerEmotion(
        targetPlayerId,
        'frustrated',
        2400
      );

      triggerPenaltyBadge(
        targetPlayerId,
        '🚨 CAUGHT! +2',
        'caught'
      );

      triggerVfx(
        'DRAW_TWO',
        'CAUGHT! +2 PENALTY',
        engine.players.find(
          p => p.id === targetPlayerId
        )?.name
      );

      updateState();
    }
  };

  const triggerVfx = (
    type,
    actorName,
    targetPlayerName
  ) => {
    if (type === CARD_TYPES.SKIP) {
      audioService.playSkip();

      setVfxEffect({
        type: 'SKIP',
        message: `${actorName} SKIPPED!`
      });
    } else if (
      type === CARD_TYPES.REVERSE
    ) {
      audioService.playReverse();

      setVfxEffect({
        type: 'REVERSE',
        message: 'DIRECTION REVERSED!'
      });
    } else if (
      type === CARD_TYPES.DRAW_TWO
    ) {
      audioService.playDrawTwo();

      setVfxEffect({
        type: 'DRAW_TWO',
        message: '+2 ATTACK!',
        targetPlayerName
      });
    } else if (
      type === CARD_TYPES.WILD
    ) {
      audioService.playWild();

      setVfxEffect({
        type: 'WILD',
        message: 'WILD COLOR SHIFT!'
      });
    } else if (
      type === CARD_TYPES.WILD_DRAW_FOUR
    ) {
      audioService.playWildFour();

      setVfxEffect({
        type: 'WILD_DRAW_FOUR',
        message: 'WILD +4 STRIKE!',
        targetPlayerName
      });
    } else if (type === 'UNO') {
      audioService.playUno();

      setVfxEffect({
        type: 'UNO',
        message: `${actorName} SHOUTS UNO!`
      });
    }

    setTimeout(
      () => setVfxEffect(null),
      1600
    );
  };

  const triggerReaction = (
    playerId,
    emote,
    phrase = null
  ) => {
    audioService.playReaction(emote);

    setActiveReactions(prev => ({
      ...prev,
      [playerId]: {
        emote,
        phrase
      }
    }));

    /*
     * Broadcast the reaction to other players when the
     * SocketGameEngine supports multiplayer reactions.
     */
    if (
      playerId === localPlayerId &&
      typeof engine.sendReaction === 'function'
    ) {
      engine.sendReaction(
        emote,
        phrase
      );
    }

    setTimeout(() => {
      setActiveReactions(prev => {
        const copy = { ...prev };

        delete copy[playerId];

        return copy;
      });
    }, 2400);
  };

  const playableCardIds = new Set(
    (localPlayer?.hand || [])
      .filter(card =>
        engine.canPlayCard(card)
      )
      .map(card => card.id)
  );

  // Deterministic Clockwise Seating Map
  const myIndex =
    gameState.players.findIndex(
      p => p.id === localPlayerId
    );

  const orderedOpponents = [];

  if (myIndex !== -1) {
    for (
      let i = 1;
      i < gameState.players.length;
      i++
    ) {
      orderedOpponents.push(
        gameState.players[
          (myIndex + i) %
          gameState.players.length
        ]
      );
    }
  } else {
    orderedOpponents.push(
      ...gameState.players.filter(
        p => p.id !== localPlayerId
      )
    );
  }

  const getSeatPosition = (
    idx,
    total
  ) => {
    if (total === 1) return 'top';

    if (total === 2) {
      return idx === 0
        ? 'top-right'
        : 'top-left';
    }

    if (total === 3) {
      if (idx === 0) return 'right';
      if (idx === 1) return 'top';
      return 'left';
    }

    if (total === 4) {
      const seats = [
        'right',
        'top-right',
        'top-left',
        'left'
      ];

      return seats[idx] || 'top';
    }

    const fullSeats = [
      'right',
      'top-right',
      'top',
      'top-left',
      'left',
      'bottom-left',
      'bottom-right'
    ];

    return (
      fullSeats[
        idx % fullSeats.length
      ]
    );
  };

  return (
    <div
      className={`arena-page-root ${
        isMyTurn
          ? 'screen-turn-pulse'
          : ''
      } ${
        isMobileLandscape
          ? 'is-mobile-landscape'
          : ''
      }`}
    >
      {/* 1. Dynamic Environment Atmosphere */}
      <GameErrorBoundary
        fallback={
          <div className="environment-root arena-royal_palace" />
        }
      >
        <EnvironmentLayer
          arenaId={
            activeArena ||
            'ROYAL_PALACE'
          }
          theme={
            gameTheme || 'dark'
          }
        />
      </GameErrorBoundary>

      {/* 2. Top Arena HUD Header */}
      <div className="game-top-hud">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <button
            className="game-btn-circle"
            onClick={() => {
              audioService.playButtonClick();
              onExit();
            }}
            title="Leave Table"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            className="game-btn-pill"
            style={{
              padding: '5px 12px',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background:
                'rgba(23, 17, 46, 0.75)',
              borderColor:
                'var(--gold-main)'
            }}
            onClick={() =>
              setIsArenaPickerOpen(true)
            }
            title="Switch Environment Arena"
          >
            <span>
              {currentArenaMeta.icon}
            </span>

            <span
              style={{
                fontWeight: 800
              }}
            >
              {currentArenaMeta.name}
            </span>

            <span
              style={{
                fontSize: '0.65rem',
                opacity: 0.7
              }}
            >
              ▾
            </span>
          </button>
        </div>

        <span
          className="game-arena-top-title"
          style={{
            fontFamily:
              'var(--font-title)',
            fontSize: '1.05rem',
            fontWeight: 900,
            color:
              'var(--gold-glow)'
          }}
        >
          UNO ARENA
        </span>

        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}
        >
          <button
            className="game-btn-circle"
            onClick={
              handleToggleTheme
            }
            title={
              gameTheme === 'dark'
                ? 'Switch to Daylight Arena'
                : 'Switch to Dark Royalty'
            }
          >
            {gameTheme === 'dark' ? (
              <Moon
                size={18}
                color="#FFDF00"
              />
            ) : (
              <Sun
                size={18}
                color="#B87800"
              />
            )}
          </button>

          <button
            className={`game-btn-circle ${
              !musicMuted
                ? 'active-audio'
                : ''
            }`}
            onClick={
              handleToggleMusic
            }
            title={
              musicMuted
                ? 'Turn Ambient Music ON'
                : 'Turn Ambient Music OFF'
            }
          >
            <Music
              size={18}
              color={
                musicMuted
                  ? 'rgba(255,255,255,0.45)'
                  : '#FFD700'
              }
            />
          </button>

          <button
            className="game-btn-circle"
            onClick={() => {
              const nextMuted =
                !soundMuted;

              setSoundMuted(nextMuted);

              audioService.setSfxEnabled(
                !nextMuted
              );
            }}
            title={
              soundMuted
                ? 'Unmute Sound Effects'
                : 'Mute Sound Effects'
            }
          >
            {soundMuted ? (
              <VolumeX size={18} />
            ) : (
              <Volume2 size={18} />
            )}
          </button>

          <button
            className="game-btn-circle"
            onClick={() => {
              try {
                audioService.playButtonClick?.();
              } catch {}

              setIsHowToPlayOpen(
                true
              );
            }}
            title="How to Play & Audio Guide"
          >
            <HelpCircle size={18} />
          </button>

          <button
            className="game-btn-circle"
            onClick={() =>
              setIsReactionPickerOpen(
                true
              )
            }
            title="Send Reaction"
          >
            <MessageSquare size={18} />
          </button>
        </div>
      </div>

      {/* 2b. Dedicated Full ROTATE YOUR PHONE Overlay */}
      {isPortrait &&
        !dismissLandscapePrompt && (
          <div className="portrait-rotate-modal-overlay">
            <div className="portrait-rotate-modal-card">
              <div className="portrait-rotate-phone-anim">
                <div className="phone-icon-body" />
              </div>

              <div className="portrait-rotate-title">
                ROTATE YOUR PHONE
              </div>

              <p className="portrait-rotate-desc">
                UNO ARENA is built for{' '}
                <strong>
                  Mobile Landscape
                </strong>{' '}
                (844×390 / 896×414). Turn your device horizontally for the ultimate 3D arena table view!
              </p>

              <div className="portrait-rotate-actions">
                <button
                  className="portrait-rotate-dismiss-btn"
                  onClick={() =>
                    setDismissLandscapePrompt(
                      true
                    )
                  }
                >
                  Continue in Portrait Mode ❯
                </button>
              </div>
            </div>
          </div>
        )}

      {/* 3. YOUR TURN Banner */}
      {showYourTurnBanner && (
        <div className="turn-banner-overlay">
          👑 YOUR TURN TO PLAY!
        </div>
      )}

      {/* 4. Match Start Cinematic Intro */}
      {isMatchIntroActive && (
        <CinematicMatchStart
          starterCard={
            gameState.topCard
          }
          onComplete={() =>
            setIsMatchIntroActive(
              false
            )
          }
        />
      )}

      {/* 5. Special Cards VFX */}
      <SpecialEffectsOverlay
        effect={vfxEffect}
      />

      {/* 6. Game Table */}
      <div className="game-table-stage">
        {orderedOpponents.map(
          (opp, idx) => {
            const seatPos =
              getSeatPosition(
                idx,
                orderedOpponents.length
              );

            return (
              <GamePlayerSeat
                key={opp.id}
                player={opp}
                position={seatPos}
                isActiveTurn={
                  gameState.currentTurnPlayerId ===
                  opp.id
                }
                turnTimeLeft={
                  turnTimeLeft
                }
                reaction={
                  activeReactions[
                    opp.id
                  ]
                }
                penaltyBadge={
                  penaltyBadges[
                    opp.id
                  ]
                }
                isNewJoin={
                  newJoinedPlayerIds.has(
                    opp.id
                  )
                }
                emotion={
                  playerEmotions[
                    opp.id
                  ] || 'normal'
                }
                onCatchUno={
                  handleCatchUno
                }
              />
            );
          }
        )}

        <GameTable
          topCard={
            gameState.topCard
          }
          currentColor={
            gameState.currentColor
          }
          deckRemaining={
            gameState.deckRemaining
          }
          direction={
            gameState.direction
          }
          onDrawCard={
            handleDrawCard
          }
          isMyTurn={isMyTurn}
          discardShake={
            discardBounce
          }
          activeArena={
            activeArena
          }
          theme={gameTheme}
        />
      </div>

      {/* 7. Bottom Local Player Hand */}
      <div className="bottom-player-section">
        {penaltyBadges[
          localPlayerId
        ] && (
          <div
            className={`local-player-penalty-badge penalty-${
              penaltyBadges[
                localPlayerId
              ].type || 'draw'
            }`}
          >
            <span className="penalty-badge-icon">
              💥
            </span>

            <span className="penalty-badge-text">
              {
                penaltyBadges[
                  localPlayerId
                ].text
              }
            </span>
          </div>
        )}

        <div className="hand-action-bar">
          <button
            className="game-btn-circle"
            onClick={() =>
              setIsReactionPickerOpen(
                true
              )
            }
            style={{
              fontSize: '1.25rem'
            }}
          >
            😎
          </button>

          {localPlayer?.hand?.length <=
            2 && (
            <button
              className="game-btn-play"
              style={{
                padding:
                  '8px 24px',
                fontSize: '1.05rem',
                minHeight: '44px'
              }}
              onClick={
                handleCallUno
              }
            >
              👑 UNO!
            </button>
          )}

          {isMyTurn &&
            engine.hasDrawnThisTurn && (
              <button
                className="game-btn-pill"
                onClick={
                  handlePassTurn
                }
              >
                Pass Turn ❯
              </button>
            )}
        </div>

        <CardHand
          cards={
            localPlayer?.hand || []
          }
          playableCardIds={
            playableCardIds
          }
          isMyTurn={isMyTurn}
          onPlayCard={
            handlePlayCard
          }
        />
      </div>

      {/* Flying Card Projectile */}
      {flyingCard && (
        <div
          className="card-flight-projectile"
          style={{
            top: '50%',
            left: '50%',
            transform:
              'translate(-50%, -50%) scale(1.05) rotate(12deg)'
          }}
        >
          <GameCard
            card={flyingCard}
            size="lg"
          />
        </div>
      )}

      {/* Color Picker Modal */}
      {pendingWildCard && (
        <ColorPickerModal
          onSelectColor={
            handleColorSelected
          }
        />
      )}

      {/* Reaction Popover */}
      <ReactionPicker
        isOpen={
          isReactionPickerOpen
        }
        onClose={() =>
          setIsReactionPickerOpen(
            false
          )
        }
        onSendReaction={({
          emote,
          phrase
        }) => {
          triggerReaction(
            localPlayerId,
            emote,
            phrase
          );
        }}
      />

      {/* In-Game Dynamic Arena Switcher */}
      {isArenaPickerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor:
              'rgba(6, 4, 12, 0.85)',
            backdropFilter:
              'blur(10px)',
            zIndex: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() =>
            setIsArenaPickerOpen(
              false
            )
          }
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '380px',
              padding: '20px',
              border:
                '2px solid var(--gold-main)',
              display: 'flex',
              flexDirection:
                'column',
              gap: '12px'
            }}
            onClick={e =>
              e.stopPropagation()
            }
          >
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems: 'center'
              }}
            >
              <div
                style={{
                  fontFamily:
                    'var(--font-title)',
                  color:
                    'var(--gold-glow)',
                  fontSize:
                    '1.15rem',
                  fontWeight: 900
                }}
              >
                SELECT ARENA WORLD
              </div>

              <button
                className="game-btn-circle"
                style={{
                  width: '32px',
                  height: '32px'
                }}
                onClick={() =>
                  setIsArenaPickerOpen(
                    false
                  )
                }
              >
                <X size={16} />
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection:
                  'column',
                gap: '8px'
              }}
            >
              {ARENAS.map(a => {
                const isSelected =
                  activeArena ===
                  a.id;

                return (
                  <button
                    key={a.id}
                    onClick={() =>
                      handleSelectArena(
                        a.id
                      )
                    }
                    style={{
                      display: 'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'space-between',
                      padding:
                        '10px 14px',
                      borderRadius:
                        '14px',
                      background:
                        isSelected
                          ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(36, 26, 53, 0.9) 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                      border:
                        isSelected
                          ? '2px solid var(--gold-main)'
                          : '1px solid rgba(255, 255, 255, 0.12)',
                      cursor:
                        'pointer',
                      textAlign:
                        'left'
                    }}
                  >
                    <div
                      style={{
                        display:
                          'flex',
                        alignItems:
                          'center',
                        gap: '10px'
                      }}
                    >
                      <span
                        style={{
                          fontSize:
                            '1.6rem'
                        }}
                      >
                        {a.icon}
                      </span>

                      <div>
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize:
                              '0.9rem',
                            color:
                              isSelected
                                ? 'var(--gold-glow)'
                                : '#FFFFFF'
                          }}
                        >
                          {a.name}
                        </div>

                        <div
                          style={{
                            fontSize:
                              '0.7rem',
                            color:
                              'rgba(255, 255, 255, 0.65)'
                          }}
                        >
                          {a.desc}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <span
                        style={{
                          color:
                            'var(--gold-glow)',
                          fontWeight: 900,
                          fontSize:
                            '0.8rem'
                        }}
                      >
                        ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* How to Play Guide */}
      <HowToPlayModal
        isOpen={
          isHowToPlayOpen
        }
        onClose={() =>
          setIsHowToPlayOpen(
            false
          )
        }
      />
    </div>
  );
}
