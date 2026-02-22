import { useAuth } from '../../contexts/AuthContext';
import { SignOut } from '../auth/SignOut';
import './Header.css';

interface HeaderProps {
  selectedCity?: string | null;
  onChangeCity?: () => void;
}

export function Header({ selectedCity, onChangeCity }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">Travel Planning App</h1>
        {user && (
          <div className="header-user">
            {selectedCity && onChangeCity && (
              <button type="button" onClick={onChangeCity} className="change-city-button">
                Change city
              </button>
            )}
            <span className="user-email">{user.email}</span>
            <SignOut />
          </div>
        )}
      </div>
    </header>
  );
}
