import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Pull Tabs Treasure!</h1>
        <p className="hero-subtitle">
          Experience the thrill of digital pull tabs with a pirate treasure theme
        </p>
        
        <div className="game-info">
          <div className="info-card">
            <h3>How to Play</h3>
            <ul>
              <li>Purchase a ticket for $1</li>
              <li>Flip the ticket to reveal 5 tabs</li>
              <li>Pull each tab to uncover symbols</li>
              <li>Match Skull-Skull-X patterns to win!</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h3>Prize Table</h3>
            <ul>
              <li>💀💀💀 Three Skulls - $100</li>
              <li>💀💀💎 Skull-Skull-Treasure - $50</li>
              <li>💀💀⛵ Skull-Skull-Ship - $20</li>
              <li>💀💀⚓ Skull-Skull-Anchor - $10</li>
              <li>💀💀🧭 Skull-Skull-Compass - $5</li>
              <li>💀💀🗺️ Skull-Skull-Map - $2</li>
            </ul>
          </div>
        </div>
        
        <div className="cta-section">
          {user ? (
            <Link to="/game" className="cta-button">
              Play Now
            </Link>
          ) : (
            <div className="cta-buttons">
              <Link to="/login" className="cta-button">
                Login to Play
              </Link>
              <Link to="/register" className="cta-button secondary">
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}