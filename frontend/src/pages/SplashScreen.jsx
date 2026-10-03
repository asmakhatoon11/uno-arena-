import React, { useEffect, useState } from 'react';
import { audioService } from '../services/audioService';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 350);
          return 100;
        }
        return prev + 5;
      });
    }, 90);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, #241A35 0%, #14101F 55%, #08070D 100%)',
        padding: '24px',
        overflow: 'hidden'
      }}
    >
      {/* Background Animated Subtle Card Silhouettes */}
      <div
        style={{
          position: 'absolute',
          top: '12%',
          left: '8%',
          width: '90px',
          height: '135px',
          borderRadius: '14px',
          border: '1.5px solid rgba(212, 175, 55, 0.15)',
          transform: 'rotate(-20deg)',
          animation: 'playablePulse 4s infinite ease-in-out',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '18%',
          right: '8%',
          width: '100px',
          height: '150px',
          borderRadius: '14px',
          border: '1.5px solid rgba(255, 59, 48, 0.15)',
          transform: 'rotate(25deg)',
          animation: 'playablePulse 4s infinite ease-in-out reverse',
          pointerEvents: 'none'
        }}
      />

      {/* Main Logo Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 10,
          animation: 'unoTitlePop 1.2s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
        }}
      >
        {/* Crown Crest */}
        <div
          style={{
            fontSize: '3.5rem',
            marginBottom: '-6px',
            filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.8))'
          }}
        >
          👑
        </div>

        {/* Brand Title */}
        <h1
          className="gold-text"
          style={{
            fontSize: '3.4rem',
            letterSpacing: '3px',
            textShadow: '0 0 25px rgba(212, 175, 55, 0.6), 0 8px 30px rgba(0, 0, 0, 0.9)',
            margin: '0',
            lineHeight: 1.1
          }}
        >
          UNO ARENA
        </h1>

        {/* Tagline */}
        <p
          style={{
            marginTop: '10px',
            fontSize: '0.95rem',
            fontWeight: 800,
            letterSpacing: '2.5px',
            color: '#FFFFFF',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
          }}
        >
          PLAY. MATCH. SHOUT UNO.
        </p>
      </div>

      {/* Loading Progress Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '12%',
          width: '70%',
          maxWidth: '280px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10
        }}
      >
        <div
          style={{
            width: '100%',
            height: '6px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '999px',
            overflow: 'hidden',
            border: '1px solid rgba(212, 175, 55, 0.3)'
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'var(--gold-gradient)',
              borderRadius: '999px',
              transition: 'width 0.1s linear',
              boxShadow: '0 0 10px rgba(255, 241, 168, 0.8)'
            }}
          />
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--gold-light)',
            letterSpacing: '1px'
          }}
        >
          ENTERING THE ARENA... {progress}%
        </span>
      </div>
    </div>
  );
}
