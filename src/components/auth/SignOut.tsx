import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

export function SignOut() {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  return (
    <button onClick={handleSignOut} disabled={loading} className="sign-out-button">
      {loading ? 'Signing out...' : 'Sign Out'}
    </button>
  );
}
