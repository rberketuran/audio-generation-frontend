import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          🎵 Music Creation
        </Link>
        <Link 
          to="/voice-conversion" 
          className={`nav-link ${location.pathname === '/voice-conversion' ? 'active' : ''}`}
        >
          🎤 Voice Conversion
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
