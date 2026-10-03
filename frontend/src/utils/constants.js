export const COLORS = {
  RED: 'RED',
  BLUE: 'BLUE',
  GREEN: 'GREEN',
  YELLOW: 'YELLOW',
  WILD: 'WILD'
};

export const COLOR_HEX = {
  RED: '#FF3B30',
  BLUE: '#0A84FF',
  GREEN: '#30D158',
  YELLOW: '#FFD60A',
  WILD: 'linear-gradient(135deg, #FF3B30 0%, #0A84FF 33%, #30D158 66%, #FFD60A 100%)'
};

export const CARD_TYPES = {
  NUMBER: 'NUMBER',
  SKIP: 'SKIP',
  REVERSE: 'REVERSE',
  DRAW_TWO: 'DRAW_TWO',
  WILD: 'WILD',
  WILD_DRAW_FOUR: 'WILD_DRAW_FOUR'
};

export const GAME_MODES = {
  CLASSIC: 'CLASSIC',
  QUICK_MATCH: 'QUICK_MATCH',
  FRIENDS: 'FRIENDS',
  PRACTICE: 'PRACTICE',
  TUTORIAL: 'TUTORIAL'
};

export const ARENAS = [
  {
    id: 'ROYAL_PALACE',
    name: 'Royal Palace',
    desc: 'The grand gilded chamber of the high monarchs',
    bg: 'radial-gradient(ellipse at center, #241A35 0%, #14101F 60%, #08070D 100%)',
    tableBorder: '#D4AF37',
    felt: '#1A1428',
    icon: '👑'
  },
  {
    id: 'CHAMPIONSHIP',
    name: 'Championship Arena',
    desc: 'The ultimate colosseum under roaring stadium lights',
    bg: 'radial-gradient(ellipse at center, #2A1B4E 0%, #150F28 60%, #080612 100%)',
    tableBorder: '#FFD60A',
    felt: '#1F143A',
    icon: '🏆'
  },
  {
    id: 'NEON_CITY',
    name: 'Neon Cyber Arena',
    desc: 'High-tech cyber metropolis glowing with violet neon',
    bg: 'radial-gradient(ellipse at center, #1A1F3C 0%, #0D1024 60%, #060814 100%)',
    tableBorder: '#00F0FF',
    felt: '#121830',
    icon: '⚡'
  },
  {
    id: 'SUNSET_BEACH',
    name: 'Golden Sunset',
    desc: 'Warm evening breeze on the royal luxury coast',
    bg: 'radial-gradient(ellipse at center, #3A1C28 0%, #20101B 60%, #0B0609 100%)',
    tableBorder: '#FF9500',
    felt: '#281320',
    icon: '🌅'
  },
  {
    id: 'CINEMA_HALL',
    name: 'Velvet Cinema',
    desc: 'Deep crimson velvet luxury theater ambiance',
    bg: 'radial-gradient(ellipse at center, #35141A 0%, #1C0A0E 60%, #0A0406 100%)',
    tableBorder: '#FF3B30',
    felt: '#240E14',
    icon: '🎬'
  },
  {
    id: 'MYSTIC_FOREST',
    name: 'Emerald Grove',
    desc: 'Enchanted royal sanctuary bathed in emerald moonlight',
    bg: 'radial-gradient(ellipse at center, #102B1D 0%, #0A1B12 60%, #040D08 100%)',
    tableBorder: '#30D158',
    felt: '#0E2419',
    icon: '🌿'
  }
];

export const EMOTES = ['😂', '😎', '🔥', '😱', '👏', '😈', '🤯', '💀', '❤️', '👀'];

export const QUICK_CHAT = [
  'Nice move!',
  'UNO!',
  'Good game!',
  'Oops!',
  'Wow!',
  'Let\'s go!',
  'Well played!'
];

export const AVATARS = [
  { id: 'av_1', icon: '👑', name: 'Sovereign' },
  { id: 'av_2', icon: '🦁', name: 'Golden Lion' },
  { id: 'av_3', icon: '⚔️', name: 'Knight Commander' },
  { id: 'av_4', icon: '💎', name: 'Archmage' },
  { id: 'av_5', icon: '🛡️', name: 'Grand Guardian' },
  { id: 'av_6', icon: '🦅', name: 'Royal Falcon' },
  { id: 'av_7', icon: '🔥', name: 'Dragon Master' },
  { id: 'av_8', icon: '⭐', name: 'Celestial Star' }
];

export const CARD_THEMES = [
  { id: 'royal_classic', name: 'Royal Classic', style: 'gold-rim', desc: 'Standard luxurious gilded styling' },
  { id: 'dark_obsidian', name: 'Dark Obsidian', style: 'obsidian', desc: 'Matte dark finish with neon accents' },
  { id: 'golden_velvet', name: 'Golden Velvet', style: 'velvet', desc: 'Deep velvet texture with heavy 24k gold edges' }
];
