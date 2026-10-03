import React, { useEffect, useState } from 'react';

/**
 * EnvironmentLayer — Immersive Multi-Environment 3D Game World
 * Perfectly frames the grand felt table from top, left, right, and bottom periphery.
 * 
 * Supports 5 Rich Interactive Arenas with Full DARK & LIGHT Theme Adaptations:
 * 1. ROYAL_PALACE / ROYAL_GARDEN:
 *    - Dark: Vaulted midnight cathedral arches, gold fluted marble pillars, chandeliers, 24K gold dust.
 *    - Light: Sunlit palace ballroom, ivory & gold columns, sunbeams through stained glass, golden sparkles.
 * 2. SUNSET_BEACH / BEACH:
 *    - Dark: Tropical twilight coast, setting sun horizon, framing palms with flickering tiki torches.
 *    - Light: Azure sky, crystal turquoise sea waves, sunlit emerald coconut palms, golden sand floor.
 * 3. MYSTIC_FOREST / PARK / COZY_PARK:
 *    - Dark: Enchanted twilight grove, ancient mossy oak/willow boughs, glowing vines, pulsating fireflies.
 *    - Light: Sun-dappled summer park glade, golden sunbeams (god rays), blooming floral petals, fresh lawn.
 * 4. NEON_CITY / NEON_NIGHT:
 *    - Dark: Cyberpunk nocturnal megacity, glowing skyscraper grid, neon signs, holographic floor grid.
 *    - Light: High-tech cyber colosseum, clean metallic skyline, cyan LED pylons, holographic arena rings.
 * 5. CHAMPIONSHIP:
 *    - Dark: Night stadium dome, dual sweeping searchlights, packed grandstands with flashing camera strobes.
 *    - Light: Sunlit open-air arena, fluttering championship banners, tiered stands, victory celebration confetti.
 */
export default function EnvironmentLayer({ arenaId = 'ROYAL_PALACE', theme }) {
  // Normalize arena ID
  const normId = (arenaId || 'ROYAL_PALACE').toUpperCase();

  // Determine current active theme ('dark' or 'light')
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (theme) return theme;
    if (typeof document !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme) {
      setCurrentTheme(theme);
      return;
    }
    // Observe changes to data-theme on html element
    const observer = new MutationObserver(() => {
      const active = document.documentElement.getAttribute('data-theme') || 'dark';
      setCurrentTheme(active);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [theme]);

  const isLight = currentTheme === 'light';

  // --- 1. ROYAL PALACE ---
  const renderPalace = () => (
    <div className={`env-scene palace-scene ${isLight ? 'mode-light' : 'mode-dark'}`}>
      <svg className="env-svg-backdrop" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <defs>
          <linearGradient id={isLight ? "palacePillarL" : "palacePillarD"} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isLight ? "#F8F5EE" : "#140B22"} />
            <stop offset="50%" stopColor={isLight ? "#ECE3D2" : "#281742"} />
            <stop offset="100%" stopColor={isLight ? "#DDD0BB" : "#11081E"} />
          </linearGradient>
          <linearGradient id="palaceGoldTrim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="35%" stopColor="#F5D76E" />
            <stop offset="70%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8C6500" />
          </linearGradient>
          <radialGradient id={isLight ? "palaceSkyL" : "palaceSkyD"} cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor={isLight ? "#FFFDF7" : "#2E1B4E"} stopOpacity="1" />
            <stop offset="55%" stopColor={isLight ? "#EFE7F8" : "#150C26"} stopOpacity="0.95" />
            <stop offset="100%" stopColor={isLight ? "#D8C7EB" : "#07040E"} stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Ambient Palace Ceiling / Sky */}
        <rect width="1440" height="900" fill={`url(#${isLight ? "palaceSkyL" : "palaceSkyD"})`} />

        {/* Sunbeams streaming in Light Mode */}
        {isLight && (
          <g opacity="0.35">
            <polygon points="180,0 260,0 420,900 240,900" fill="url(#palaceGoldTrim)" />
            <polygon points="1260,0 1180,0 1020,900 1200,900" fill="url(#palaceGoldTrim)" />
          </g>
        )}

        {/* Left & Right Grand Marble Pillars framing table */}
        <path d="M0,0 L200,0 L160,900 L0,900 Z" fill={`url(#${isLight ? "palacePillarL" : "palacePillarD"})`} />
        <path d="M1440,0 L1240,0 L1280,900 L1440,900 Z" fill={`url(#${isLight ? "palacePillarL" : "palacePillarD"})`} />
        
        {/* Fluted Pillar Gold Trims */}
        <path d="M196,0 L202,0 L162,900 L156,900 Z" fill="url(#palaceGoldTrim)" opacity="0.85" />
        <path d="M1244,0 L1238,0 L1278,900 L1284,900 Z" fill="url(#palaceGoldTrim)" opacity="0.85" />
        <line x1="80" y1="0" x2="65" y2="900" stroke="url(#palaceGoldTrim)" strokeWidth="2.5" opacity="0.45" />
        <line x1="1360" y1="0" x2="1375" y2="900" stroke="url(#palaceGoldTrim)" strokeWidth="2.5" opacity="0.45" />

        {/* Grand Cathedral Arch Top Ceiling Framing HUD */}
        <path d="M160,170 Q720,25 1280,170 L1280,0 L160,0 Z" fill={isLight ? "#EFE7F8" : "#170C28"} opacity="0.95" />
        <path d="M175,170 Q720,40 1265,170" fill="none" stroke="url(#palaceGoldTrim)" strokeWidth="5" opacity="0.9" />
        <path d="M220,135 Q720,65 1220,135" fill="none" stroke="url(#palaceGoldTrim)" strokeWidth="2.5" opacity="0.5" />

        {/* Imperial Crown Keystone Crest in Arch Center */}
        <circle cx="720" cy="45" r="16" fill="url(#palaceGoldTrim)" />
        <polygon points="720,24 712,40 728,40" fill="#FFF9C4" />

        {/* Bottom Marble Floor Perspective Lines */}
        <line x1="0" y1="780" x2="1440" y2="780" stroke="url(#palaceGoldTrim)" strokeWidth="2" opacity="0.25" />
        <line x1="160" y1="900" x2="520" y2="780" stroke="url(#palaceGoldTrim)" strokeWidth="1.5" opacity="0.3" />
        <line x1="1280" y1="900" x2="920" y2="780" stroke="url(#palaceGoldTrim)" strokeWidth="1.5" opacity="0.3" />
      </svg>

      {/* Floating 24K Royal Gold Dust Particles */}
      <div className="env-dust-particle d1" />
      <div className="env-dust-particle d2" />
      <div className="env-dust-particle d3" />
      <div className="env-dust-particle d4" />
    </div>
  );

  // --- 2. TROPICAL BEACH ---
  const renderBeach = () => (
    <div className={`env-scene beach-scene ${isLight ? 'mode-light' : 'mode-dark'}`}>
      <svg className="env-svg-backdrop" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <defs>
          {/* Sunset Dusk Sky (Dark Theme) */}
          <linearGradient id="beachSunsetSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#240A22" />
            <stop offset="30%" stopColor="#4D1533" />
            <stop offset="60%" stopColor="#8A2E35" />
            <stop offset="85%" stopColor="#DF6526" />
            <stop offset="100%" stopColor="#FFA63D" />
          </linearGradient>

          {/* Tropical Azure Sky (Light Theme) */}
          <linearGradient id="beachDaySky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1DA1F2" />
            <stop offset="40%" stopColor="#55C4F5" />
            <stop offset="75%" stopColor="#9DE2FC" />
            <stop offset="100%" stopColor="#E0F7FE" />
          </linearGradient>

          {/* Ocean Waves Gradient */}
          <linearGradient id="beachOceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isLight ? "#00A896" : "#4A1828"} />
            <stop offset="50%" stopColor={isLight ? "#02C39A" : "#2E0E1B"} />
            <stop offset="100%" stopColor={isLight ? "#028090" : "#17060F"} />
          </linearGradient>

          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isLight ? "#FFFCE8" : "#FFE066"} stopOpacity="0.95" />
            <stop offset="45%" stopColor={isLight ? "#FFDE59" : "#FF7A29"} stopOpacity="0.7" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky Fill */}
        <rect width="1440" height="900" fill={`url(#${isLight ? "beachDaySky" : "beachSunsetSky"})`} />

        {/* Sun Disk on Sky / Horizon */}
        <circle cx={isLight ? "1180" : "720"} cy={isLight ? "160" : "440"} r={isLight ? "90" : "150"} fill="url(#sunGlow)" />

        {/* Distant Ocean Horizon */}
        <rect x="0" y="470" width="1440" height="220" fill="url(#beachOceanGrad)" opacity="0.8" />
        <line x1="0" y1="470" x2="1440" y2="470" stroke={isLight ? "#FFFFFF" : "#FFC266"} strokeWidth="2" opacity="0.65" />
        <path d="M0,510 Q360,495 720,510 T1440,510" fill="none" stroke={isLight ? "#E0F7FE" : "#FFA347"} strokeWidth="2" opacity="0.45" />

        {/* Shoreline Golden Sand Base */}
        <path d="M0,660 Q720,620 1440,660 L1440,900 L0,900 Z" fill={isLight ? "#F5DEB3" : "#2A111C"} />
        <path d="M0,660 Q720,620 1440,660" fill="none" stroke={isLight ? "#FFFFFF" : "#FFB870"} strokeWidth="4" opacity="0.5" />

        {/* Left Lush Framing Tropical Palm Tree */}
        <path d="M-60,500 Q60,260 120,60" fill="none" stroke={isLight ? "#8B5A2B" : "#190812"} strokeWidth="24" strokeLinecap="round" />
        <path d="M120,60 Q260,110 340,220" fill="none" stroke={isLight ? "#2E7D32" : "#10040B"} strokeWidth="16" strokeLinecap="round" />
        <path d="M120,60 Q220,20 360,40" fill="none" stroke={isLight ? "#388E3C" : "#0E030A"} strokeWidth="14" strokeLinecap="round" />
        <path d="M120,60 Q80,-40 220,-80" fill="none" stroke={isLight ? "#43A047" : "#0A0207"} strokeWidth="12" strokeLinecap="round" />
        <path d="M120,60 Q-20,10 20,180" fill="none" stroke={isLight ? "#2E7D32" : "#12050D"} strokeWidth="14" strokeLinecap="round" />

        {/* Right Lush Framing Tropical Palm Tree */}
        <path d="M1500,500 Q1380,260 1320,60" fill="none" stroke={isLight ? "#8B5A2B" : "#190812"} strokeWidth="24" strokeLinecap="round" />
        <path d="M1320,60 Q1180,110 1100,220" fill="none" stroke={isLight ? "#2E7D32" : "#10040B"} strokeWidth="16" strokeLinecap="round" />
        <path d="M1320,60 Q1220,20 1080,40" fill="none" stroke={isLight ? "#388E3C" : "#0E030A"} strokeWidth="14" strokeLinecap="round" />
        <path d="M1320,60 Q1360,-40 1220,-80" fill="none" stroke={isLight ? "#43A047" : "#0A0207"} strokeWidth="12" strokeLinecap="round" />
        <path d="M1320,60 Q1460,10 1420,180" fill="none" stroke={isLight ? "#2E7D32" : "#12050D"} strokeWidth="14" strokeLinecap="round" />
      </svg>

      {/* Periphery Animated Tiki Torches on Left & Right */}
      <div className="env-tiki-torch left-torch">
        <div className="tiki-pole" />
        <div className="tiki-flame" />
      </div>
      <div className="env-tiki-torch right-torch">
        <div className="tiki-pole" />
        <div className="tiki-flame" />
      </div>

      {/* Floating Sunset Glow / Ocean Dust Particles */}
      <div className="env-dust-particle d1" style={{ background: isLight ? '#FFD60A' : '#FFA044' }} />
      <div className="env-dust-particle d2" style={{ background: isLight ? '#00F0FF' : '#FF6B35' }} />
      <div className="env-dust-particle d3" style={{ background: '#FFFFFF' }} />
    </div>
  );

  // --- 3. MYSTIC FOREST / PARK ---
  const renderPark = () => (
    <div className={`env-scene park-scene ${isLight ? 'mode-light' : 'mode-dark'}`}>
      <svg className="env-svg-backdrop" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <defs>
          <radialGradient id={isLight ? "forestSkyL" : "forestSkyD"} cx="50%" cy="20%" r="75%">
            <stop offset="0%" stopColor={isLight ? "#E8FBE8" : "#143C22"} stopOpacity="1" />
            <stop offset="60%" stopColor={isLight ? "#C7F0CE" : "#0A2012"} stopOpacity="0.95" />
            <stop offset="100%" stopColor={isLight ? "#A2DDAE" : "#030A05"} stopOpacity="1" />
          </radialGradient>
          <linearGradient id="godRayGrad" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill={`url(#${isLight ? "forestSkyL" : "forestSkyD"})`} />

        {/* Sunlight God Rays filtering through foliage in Light Mode */}
        {isLight && (
          <g>
            <polygon points="200,0 360,0 600,900 380,900" fill="url(#godRayGrad)" />
            <polygon points="800,0 960,0 1200,900 980,900" fill="url(#godRayGrad)" />
          </g>
        )}

        {/* Massive Ancient Oak & Willow Canopies Overhanging Top */}
        <path
          d="M-40,-30 Q260,200 480,50 Q720,240 960,40 Q1220,210 1480,-30 Z"
          fill={isLight ? "#2E7D32" : "#0B2213"}
          opacity="0.95"
        />
        <path
          d="M-40,-30 Q200,140 400,20 Q660,160 860,25 Q1140,150 1480,-30 Z"
          fill={isLight ? "#388E3C" : "#13371F"}
          opacity="0.8"
        />

        {/* Left & Right Flanking Gnarly Forest Trunks */}
        <path
          d="M0,0 Q160,320 80,900 L0,900 Z"
          fill={isLight ? "#5D4037" : "#07160C"}
        />
        <path
          d="M1440,0 Q1280,320 1360,900 L1440,900 Z"
          fill={isLight ? "#5D4037" : "#07160C"}
        />

        {/* Hanging Enchanted Vines on Left & Right */}
        <path d="M120,80 Q140,240 110,380" fill="none" stroke={isLight ? "#4CAF50" : "#25D366"} strokeWidth="3" opacity="0.75" />
        <path d="M160,60 Q180,200 150,320" fill="none" stroke={isLight ? "#4CAF50" : "#25D366"} strokeWidth="2.5" opacity="0.65" />
        <path d="M1320,80 Q1300,240 1330,380" fill="none" stroke={isLight ? "#4CAF50" : "#25D366"} strokeWidth="3" opacity="0.75" />
        <path d="M1280,60 Q1260,200 1290,320" fill="none" stroke={isLight ? "#4CAF50" : "#25D366"} strokeWidth="2.5" opacity="0.65" />

        {/* Base Lawn / Mossy Ground */}
        <path d="M0,740 Q720,690 1440,740 L1440,900 L0,900 Z" fill={isLight ? "#43A047" : "#05150A"} />
      </svg>

      {/* Floating Emerald Fireflies / Blossom Spores */}
      <div className="env-dust-particle d1" style={{ background: '#30D158' }} />
      <div className="env-dust-particle d2" style={{ background: '#75FF9E' }} />
      <div className="env-dust-particle d3" style={{ background: isLight ? '#FFE066' : '#00F0FF' }} />
      <div className="env-dust-particle d4" style={{ background: '#30D158' }} />
    </div>
  );

  // --- 4. NEON CYBER METROPOLIS ---
  const renderNeonCity = () => (
    <div className={`env-scene neon-scene ${isLight ? 'mode-light' : 'mode-dark'}`}>
      <svg className="env-svg-backdrop" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <defs>
          <linearGradient id={isLight ? "neonSkyL" : "neonSkyD"} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isLight ? "#1C2442" : "#080614"} />
            <stop offset="50%" stopColor={isLight ? "#121A33" : "#110D2C"} />
            <stop offset="100%" stopColor={isLight ? "#0A1024" : "#05030C"} />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill={`url(#${isLight ? "neonSkyL" : "neonSkyD"})`} />

        {/* Distant Cyber Skyscraper Silhouettes */}
        <rect x="40" y="180" width="120" height="720" fill="#0E122C" />
        <rect x="180" y="280" width="90" height="620" fill="#090E22" />
        <rect x="290" y="140" width="130" height="760" fill="#13193B" />
        <rect x="440" y="240" width="100" height="660" fill="#0B1028" />

        <rect x="900" y="220" width="110" height="680" fill="#0B1028" />
        <rect x="1030" y="130" width="140" height="770" fill="#141A3D" />
        <rect x="1190" y="270" width="90" height="630" fill="#090E22" />
        <rect x="1300" y="170" width="110" height="730" fill="#0F1430" />

        {/* Glowing Antenna Spire Beams */}
        <line x1="100" y1="180" x2="100" y2="40" stroke="#FF0055" strokeWidth="2.5" opacity="0.85" />
        <line x1="355" y1="140" x2="355" y2="20" stroke="#00F0FF" strokeWidth="3" opacity="0.9" />
        <line x1="1100" y1="130" x2="1100" y2="20" stroke="#00F0FF" strokeWidth="3" opacity="0.9" />
        <line x1="1355" y1="170" x2="1355" y2="50" stroke="#FFD60A" strokeWidth="2" opacity="0.75" />

        {/* Cyber Neon Skyscraper Window Grids */}
        <line x1="50" y1="220" x2="150" y2="220" stroke="#00F0FF" strokeWidth="1" strokeDasharray="6 8" opacity="0.6" />
        <line x1="50" y1="260" x2="150" y2="260" stroke="#FF0055" strokeWidth="1" strokeDasharray="6 8" opacity="0.6" />
        <line x1="300" y1="190" x2="410" y2="190" stroke="#00F0FF" strokeWidth="1" strokeDasharray="6 8" opacity="0.6" />
        <line x1="1040" y1="180" x2="1160" y2="180" stroke="#00F0FF" strokeWidth="1" strokeDasharray="6 8" opacity="0.6" />
        <line x1="1310" y1="210" x2="1400" y2="210" stroke="#FF0055" strokeWidth="1" strokeDasharray="6 8" opacity="0.6" />

        {/* Base Perspective Holographic Grid */}
        <line x1="0" y1="670" x2="1440" y2="670" stroke="#00F0FF" strokeWidth="1.5" opacity="0.4" />
        <line x1="0" y1="740" x2="1440" y2="740" stroke="#00F0FF" strokeWidth="2" opacity="0.55" />
        <line x1="0" y1="830" x2="1440" y2="830" stroke="#00F0FF" strokeWidth="2.5" opacity="0.7" />
        <line x1="200" y1="900" x2="400" y2="670" stroke="#00F0FF" strokeWidth="1" opacity="0.3" />
        <line x1="1240" y1="900" x2="1040" y2="670" stroke="#00F0FF" strokeWidth="1" opacity="0.3" />
      </svg>

      {/* Cyber Neon Glowing Billboards on Periphery */}
      <div className="env-neon-sign" style={{ top: '65px', left: '70px' }}>⚡ UNO-99 METRO</div>
      <div className="env-neon-sign" style={{ top: '85px', right: '80px', color: '#FF0055', borderColor: '#FF0055', boxShadow: '0 0 16px rgba(255, 0, 85, 0.5)' }}>CYBER ARENA</div>
    </div>
  );

  // --- 5. CHAMPIONSHIP STADIUM ---
  const renderChampionship = () => (
    <div className={`env-scene championship-scene ${isLight ? 'mode-light' : 'mode-dark'}`}>
      {/* Dual Sweeping Stadium Searchlights */}
      <div className="env-spotlight left-sweep" />
      <div className="env-spotlight right-sweep" />

      <svg className="env-svg-backdrop" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <defs>
          <radialGradient id={isLight ? "stadiumSkyL" : "stadiumSkyD"} cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor={isLight ? "#EBF1FC" : "#241444"} />
            <stop offset="60%" stopColor={isLight ? "#CCD9F2" : "#110925"} />
            <stop offset="100%" stopColor={isLight ? "#ADC2E8" : "#05020D"} />
          </radialGradient>
        </defs>

        <rect width="1440" height="900" fill={`url(#${isLight ? "stadiumSkyL" : "stadiumSkyD"})`} />

        {/* Stadium Roof Arch Trusses */}
        <path d="M0,90 Q720,0 1440,90" fill="none" stroke={isLight ? "#FFCC00" : "#FFD60A"} strokeWidth="5" opacity="0.8" />
        <path d="M0,120 Q720,30 1440,120" fill="none" stroke={isLight ? "#4A6FA5" : "#6E44BA"} strokeWidth="3" opacity="0.6" />

        {/* Left & Right Flanking Grandstands Packed with Fans */}
        <polygon points="0,180 240,240 240,780 0,840" fill={isLight ? "#CAD6EE" : "#0E071F"} opacity="0.9" />
        <polygon points="1440,180 1200,240 1200,780 1440,840" fill={isLight ? "#CAD6EE" : "#0E071F"} opacity="0.9" />

        {/* Stadium Tier Lines with Cheering Crowds */}
        <line x1="0" y1="280" x2="240" y2="340" stroke="#FFD60A" strokeWidth="2" strokeDasharray="8 8" opacity="0.5" />
        <line x1="0" y1="420" x2="240" y2="480" stroke="#FFD60A" strokeWidth="2" strokeDasharray="8 8" opacity="0.5" />
        <line x1="1440" y1="280" x2="1200" y2="340" stroke="#FFD60A" strokeWidth="2" strokeDasharray="8 8" opacity="0.5" />
        <line x1="1440" y1="420" x2="1200" y2="480" stroke="#FFD60A" strokeWidth="2" strokeDasharray="8 8" opacity="0.5" />

        {/* Championship Vertical Banner Ribbons */}
        <rect x="220" y="240" width="18" height="260" fill="#FF3B30" rx="3" />
        <rect x="223" y="240" width="12" height="260" fill="#FFD60A" rx="2" />
        <rect x="1202" y="240" width="18" height="260" fill="#FF3B30" rx="3" />
        <rect x="1205" y="240" width="12" height="260" fill="#FFD60A" rx="2" />
      </svg>

      {/* Floating Stadium Victory Confetti Particles */}
      <div className="env-dust-particle d1" style={{ background: '#FFD60A' }} />
      <div className="env-dust-particle d2" style={{ background: '#FFFFFF' }} />
      <div className="env-dust-particle d3" style={{ background: '#FF3B30' }} />
      <div className="env-dust-particle d4" style={{ background: '#0A84FF' }} />
    </div>
  );

  // --- 6. VELVET CINEMA HALL (Bonus) ---
  const renderCinema = () => (
    <div className={`env-scene cinema-scene ${isLight ? 'mode-light' : 'mode-dark'}`}>
      <svg className="env-svg-backdrop" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <rect width="1440" height="900" fill={isLight ? "#45141F" : "#1F070C"} />
        <polygon points="680,0 760,0 1280,900 160,900" fill="#FFF8E1" opacity={isLight ? "0.2" : "0.08"} />
        {/* Curtains */}
        <path d="M0,0 Q180,180 200,0 M200,0 Q380,180 400,0 M1040,0 Q1220,180 1240,0 M1240,0 Q1420,180 1440,0" fill="#8B152A" stroke="#D4AF37" strokeWidth="3" />
      </svg>
    </div>
  );

  return (
    <div className={`environment-root arena-${normId.toLowerCase()} theme-${currentTheme}`}>
      {(normId === 'ROYAL_PALACE' || normId === 'ROYAL_GARDEN') && renderPalace()}
      {(normId === 'NEON_CITY' || normId === 'NEON_NIGHT') && renderNeonCity()}
      {(normId === 'BEACH' || normId === 'SUNSET_BEACH') && renderBeach()}
      {(normId === 'PARK' || normId === 'MYSTIC_FOREST' || normId === 'COZY_PARK') && renderPark()}
      {(normId === 'CINEMA' || normId === 'CINEMA_HALL' || normId === 'ROOFTOP') && renderCinema()}
      {normId === 'CHAMPIONSHIP' && renderChampionship()}
      {/* Safe fallback if arena ID is unknown */}
      {!(
        normId === 'ROYAL_PALACE' || normId === 'ROYAL_GARDEN' ||
        normId === 'NEON_CITY' || normId === 'NEON_NIGHT' ||
        normId === 'BEACH' || normId === 'SUNSET_BEACH' ||
        normId === 'PARK' || normId === 'MYSTIC_FOREST' || normId === 'COZY_PARK' ||
        normId === 'CINEMA' || normId === 'CINEMA_HALL' || normId === 'ROOFTOP' ||
        normId === 'CHAMPIONSHIP'
      ) && renderPalace()}
    </div>
  );
}
