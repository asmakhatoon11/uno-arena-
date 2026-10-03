# 👑 UNO ARENA
> **PLAY. MATCH. SHOUT UNO.**

A premium, royal-themed, mobile-first card game inspired by competitive mobile game experiences, built from the ground up with original branding, 3D card graphics, procedural Web Audio effects, intelligent bots, interactive training academy, and real-time multiplayer architecture.

---

## 🌟 Highlights of the Complete Game Redesign

- 🎮 **Authentic Mobile Game Experience**: Completely eliminates the "generic web dashboard" feel. Operates with full-screen stage hierarchy, tactile 3D game buttons, and floating mobile HUD and Dock.
- 🦁 **Original Mascot Hero Stage**: Lobby features **Aurelius The Sun Sovereign Lion**, with animated idle breathing, cape wave, levitating cards, and tap reaction audio.
- 🔴 **3D Beveled PLAY Button**: Giant, tactile 3D capsule button with high-relief gold border, specular highlight reflection, and physical press-down feedback.
- 🏟️ **6 Dynamic Animated Environments**:
  - **Royal Palace**: Vaulted gothic cathedral pillars, golden chandeliers, floating dust motes.
  - **Neon City**: Cyberpunk skyscrapers with flickering holographic signs and antenna beams.
  - **Golden Beach**: Sunset lens flare, animated wave lines, and palm fronds.
  - **Emerald Grove (Park)**: Bioluminescent fairy trees and floating glowing emerald spores.
  - **Velvet Cinema**: Deep crimson draped curtains with sweeping projector light cone.
  - **Championship Arena**: Sweeping stadium floodlights with falling confetti.
- 🃏 **Dominating 3D Game Table**: The table occupies ~75–80% of the screen with a rich royal velvet felt surface, ambient table spotlight, giant stacked 3D draw deck, and discard pile with dynamic glowing color vortex.
- 🚀 **Card Flight Trajectory Physics**: Tapped cards elevate, tilt, fly along an arc projectile toward the center discard pile, rotate to match stack angle, and slam down onto the felt with impact bounce and audio snap.
- 🎬 **Cinematic Match Start**: Full intro sequence featuring players assemble, royal deck riffle and shuffle, hands dealing card-by-card, starter card flip, and 3-2-1-PLAY countdown.
- 💥 **Special Cards Visual FX Overlays**:
  - **SKIP**: Giant crimson energy barrier slam.
  - **REVERSE**: 720° rotating dual golden runic vortex arrows.
  - **DRAW TWO (+2)**: Energy card missile barrage launching across the table into victim's seat.
  - **WILD (+4)**: Four-color cosmic nova explosion expanding from table center.
  - **UNO!**: Screen darkening with golden metallic 3D UNO badge slamming the screen with shockwave ring.
- 🎓 **Interactive Training Academy**: A hands-on mini-game right on the felt table where **Mentor Leo** coaches via dynamic speech bubbles while players physically execute all 12 card mechanics.
- 🔊 **Zero-Dependency Procedural Web Audio Engine**: Synthesizes card deals, card snaps, table slams, whoosh flights, ticks, missiles, fanfares, and an ambient royal synth loop using the HTML5 Web Audio API.

---

## 🏗️ Architecture & Project Structure

```
UNO REWORK/
├── backend/
│   ├── game/
│   │   ├── Deck.js               # 108-card generator, shuffle & discard recycler
│   │   ├── UnoEngine.js          # Authoritative UNO rules, turn logic & sanitization
│   │   └── BotPlayer.js          # Bot decision matrix, reaction emotes & color picker
│   ├── rooms/
│   │   └── RoomManager.js        # 6-char room codes, matchmaking queue & bot runner
│   ├── utils/
│   │   └── constants.js          # Colors, card types, timeouts, statuses
│   ├── test-game.js              # Automated engine verification test suite (30/30 tests)
│   ├── server.js                 # Express & Socket.IO server on port 3001
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GameHUD.jsx              # Mobile game top bar (avatar, coins, gems, settings)
│   │   │   ├── GameBottomDock.jsx       # Floating mobile game dock (Lobby, Allies, Vault, Profile)
│   │   │   ├── GameTable.jsx            # Dominating 3D felt table with color vortex & stacked deck
│   │   │   ├── GameCard.jsx             # Tactile 3D cards with inner oval emblem & playable glow
│   │   │   ├── GamePlayerSeat.jsx       # Character portrait seats with emotion states & timer ring
│   │   │   ├── MascotCharacter.jsx      # Illustrated animated hero mascot (Aurelius)
│   │   │   ├── EnvironmentLayer.jsx     # 6 dynamic animated environment backdrops
│   │   │   ├── CinematicMatchStart.jsx  # Match intro sequence (deal, shuffle, 3-2-1 countdown)
│   │   │   ├── SpecialEffectsOverlay.jsx# High-octane VFX (Skip, Reverse, +2 missiles, UNO slam)
│   │   │   ├── ColorPickerModal.jsx     # 4-crystal color wheel modal
│   │   │   └── ReactionPicker.jsx       # Quick emote and shout tray
│   │   ├── pages/
│   │   │   ├── SplashScreen.jsx         # Animated logo with gold loading bar
│   │   │   ├── WelcomeScreen.jsx        # Sovereign profile setup & crest picker
│   │   │   ├── GameLobbyPage.jsx        # Hero stage, giant 3D PLAY button, mode capsules
│   │   │   ├── GameArenaPage.jsx        # Centerpiece table match with flight physics
│   │   │   ├── InteractiveTutorialPage.jsx # In-table mini-game academy with Mentor Leo
│   │   │   ├── MatchmakingScreen.jsx    # Pulsing radar & player slot join animation
│   │   │   ├── ResultScreen.jsx         # Victory/Defeat spoils box & coin counter
│   │   │   ├── GameCollectionPage.jsx   # Royal Vault (arenas, card themes, avatars)
│   │   │   ├── GameProfilePage.jsx      # Player identity card, win stats & medals
│   │   │   ├── GameFriendsPage.jsx      # Royal Allies social hub & challenge button
│   │   │   └── SettingsModal.jsx        # Audio, volume, hints, accessibility
│   │   ├── game/
│   │   │   └── localEngine.js           # Offline & instant practice engine
│   │   ├── services/
│   │   │   ├── audioService.js          # Procedural Web Audio API sound & music synth
│   │   │   └── storageService.js        # Local storage persistence
│   │   ├── styles/
│   │   │   ├── game-theme.css           # 3D game buttons, HUD bars, felt table, 3D cards
│   │   │   ├── environment.css          # Atmospheric layers & particles
│   │   │   ├── mascot.css               # Mascot breathing & floating cards
│   │   │   ├── vfx-arena.css            # Seating, match start & VFX overlays
│   │   │   ├── lobby.css                # Hero layout & 3D mode capsules
│   │   │   ├── tutorial.css             # Mentor Leo speech bubble
│   │   │   ├── result-matchmaking.css   # Matchmaking radar & spoils box
│   │   │   └── vault-profile.css        # Vault, Profile & Social Allies
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── package.json
├── README.md
└── .gitignore
```

---

## 🚀 How to Run

### 1. Run the Backend Server
```bash
cd backend
npm start
```
*Runs on port `3001` with API health endpoint at `http://localhost:3001/api/health`.*

### 2. Run the Frontend Development Server
```bash
cd frontend
npm run dev
```
*Accessible in your browser at `http://localhost:5173`.*

---

## 🧪 Test Verification

Run the automated game engine test suite:
```bash
cd backend
node test-game.js
```
```
🧪 Starting UNO ARENA Engine Verification Test Suite...
  ✓ PASS: Deck has 108 cards (Actual: 108)
  ✓ PASS: Red color has 25 cards (Actual: 25)
  ✓ PASS: Engine successfully started match
  ✓ PASS: Same color card is playable
  ✓ PASS: Same value number card of different color is playable
  ✓ PASS: Wild card is always playable
  ✓ PASS: Successfully played Skip card
  ✓ PASS: Target player drew 2 penalty cards
  ✓ PASS: Player can call UNO with 1 card
  ✓ PASS: Successfully caught opponent with 1 uncalled card
  ✓ PASS: Bot calculates best color correctly
  ✓ PASS: State Sanitization (Peer hands hidden)
========================================
Test Results: 30 / 30 Passed!
========================================
```
