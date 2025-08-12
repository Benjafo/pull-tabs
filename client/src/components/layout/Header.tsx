import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>🏴‍☠️ Pull Tabs Treasure</h1>
        </Link>
        
        <nav className="nav-menu">
          {user ? (
            <>
              <Link to="/game" className="nav-link">Play Game</Link>
              <Link to="/stats" className="nav-link">My Stats</Link>
              <div className="user-info">
                <span className="username">Ahoy, {user.username}!</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}