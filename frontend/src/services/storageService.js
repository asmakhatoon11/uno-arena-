const STORAGE_KEY = 'uno_arena_save_v1';

const DEFAULT_PROFILE = {
  id: 'player_' + Math.random().toString(36).substring(2, 9),
  name: 'Royal Sovereign',
  avatar: '👑',
  level: 1,
  xp: 120,
  xpNext: 300,
  coins: 500,
  gems: 30,
  wins: 0,
  gamesPlayed: 0,
  activeTheme: 'royal_classic',
  activeArena: 'ROYAL_PALACE',
  settings: {
    theme: 'dark',
    musicEnabled: false,
    sfxEnabled: true,
    voiceEnabled: true,
    volume: 0.8,
    voiceVolume: 0.8,
    reducedMotion: false,
    highContrast: false,
    hintsEnabled: true,
    animationsEnabled: true
  },
  friends: [
    { id: 'f1', name: 'Lady Vivienne', avatar: '💎', status: 'Online', level: 4 },
    { id: 'f2', name: 'Knight Richard', avatar: '⚔️', status: 'In Match', level: 7 },
    { id: 'f3', name: 'Count Gerald', avatar: '🦁', status: 'Offline', level: 2 }
  ],
  unlockedArenas: ['ROYAL_PALACE', 'CHAMPIONSHIP', 'NEON_CITY', 'SUNSET_BEACH', 'CINEMA_HALL', 'MYSTIC_FOREST'],
  unlockedThemes: ['royal_classic', 'dark_obsidian', 'golden_velvet']
};

class StorageService {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          settings: {
            ...DEFAULT_PROFILE.settings,
            ...(parsed.settings || {})
          }
        };
      }
    } catch {
      // LocalStorage unavailable fallback
    }
    return { ...DEFAULT_PROFILE };
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch {}
  }

  getProfile() {
    return this.data;
  }

  updateProfile(updates) {
    this.data = { ...this.data, ...updates };
    this.save();
    return this.data;
  }

  updateSettings(settingsUpdates) {
    this.data.settings = { ...this.data.settings, ...settingsUpdates };
    this.save();
    return this.data.settings;
  }

  addRewards(coins = 0, xp = 0, isWin = false) {
    this.data.coins += coins;
    this.data.xp += xp;
    this.data.gamesPlayed += 1;
    if (isWin) this.data.wins += 1;

    // Check level up
    while (this.data.xp >= this.data.xpNext) {
      this.data.xp -= this.data.xpNext;
      this.data.level += 1;
      this.data.xpNext = Math.floor(this.data.xpNext * 1.4);
      this.data.gems += 5; // Level up gem bonus
    }

    this.save();
    return this.data;
  }
}

export const storageService = new StorageService();
