import React from 'react';

/**
 * GameErrorBoundary — Robust Error Boundary
 * Prevents rendering failures in optional visual/audio layers from crashing the game.
 */
export default class GameErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('GameErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          padding: '24px',
          backgroundColor: '#0D0A1C',
          color: '#FFFFFF',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.4rem', marginBottom: '12px' }}>👑</div>
          <h2 style={{ fontFamily: 'var(--font-title, serif)', color: 'var(--gold-glow, #FFD60A)', marginBottom: '8px' }}>
            Match Recovery
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.9rem', maxWidth: '340px', marginBottom: '20px' }}>
            An unexpected visual glitch occurred, but your match progress is preserved.
          </p>
          <button
            className="game-btn-pill"
            style={{ padding: '10px 24px', cursor: 'pointer' }}
            onClick={this.handleReset}
          >
            Return to Lobby
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
