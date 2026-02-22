import './Navigation.css';

interface NavigationProps {
  currentView: 'browse' | 'saved';
  onViewChange: (view: 'browse' | 'saved') => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <nav className="app-navigation">
      <button
        className={`nav-button ${currentView === 'browse' ? 'active' : ''}`}
        onClick={() => onViewChange('browse')}
      >
        Browse Places
      </button>
      <button
        className={`nav-button ${currentView === 'saved' ? 'active' : ''}`}
        onClick={() => onViewChange('saved')}
      >
        Saved Places
      </button>
    </nav>
  );
}
