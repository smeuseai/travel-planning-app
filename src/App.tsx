import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SignUp } from './components/auth/SignUp';
import { SignIn } from './components/auth/SignIn';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { CitySelector } from './components/city/CitySelector';
import { LikeDislikeStack } from './components/place/LikeDislikeStack';
import { SavedList } from './components/saved/SavedList';
import { getPlaces } from './services/placesApi';
import { Place } from './types';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'browse' | 'saved'>('browse');
  const [browseComplete, setBrowseComplete] = useState(false);

  useEffect(() => {
    if (selectedCity && currentView === 'browse') {
      loadPlaces();
    }
  }, [selectedCity, currentView]);

  const loadPlaces = async () => {
    if (!selectedCity) return;
    
    setPlacesLoading(true);
    try {
      const fetchedPlaces = await getPlaces(selectedCity);
      setPlaces(fetchedPlaces);
      setBrowseComplete(false);
    } catch (error) {
      console.error('Error loading places:', error);
    } finally {
      setPlacesLoading(false);
    }
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCurrentView('browse');
    setBrowseComplete(false);
  };

  const handleBrowseComplete = () => {
    setBrowseComplete(true);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-auth">
        <Header />
        <div className="auth-switch">
          <button
            className={`auth-tab ${!showSignUp ? 'active' : ''}`}
            onClick={() => setShowSignUp(false)}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${showSignUp ? 'active' : ''}`}
            onClick={() => setShowSignUp(true)}
          >
            Sign Up
          </button>
        </div>
        {showSignUp ? <SignUp /> : <SignIn />}
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        selectedCity={selectedCity}
        onChangeCity={() => setSelectedCity(null)}
      />
      <ProtectedRoute>
        {!selectedCity ? (
          <div className="app-city-select">
            <CitySelector onCitySelect={handleCitySelect} />
          </div>
        ) : (
          <>
            <Navigation currentView={currentView} onViewChange={setCurrentView} />
            <main className="app-main">
              {currentView === 'browse' ? (
                <div className="browse-view">
                  {placesLoading ? (
                    <div className="loading-state">
                      <div className="spinner"></div>
                      <p>Loading places in {selectedCity}...</p>
                    </div>
                  ) : browseComplete ? (
                    <div className="browse-complete">
                      <h2>You've explored all places!</h2>
                      <p>Check out your saved places or select a different city.</p>
                      <button
                        onClick={() => setCurrentView('saved')}
                        className="view-saved-button"
                      >
                        View Saved Places
                      </button>
                    </div>
                  ) : places.length > 0 ? (
                    <LikeDislikeStack
                      places={places}
                      city={selectedCity}
                      onComplete={handleBrowseComplete}
                    />
                  ) : (
                    <div className="empty-state">
                      <p>No places found for {selectedCity}.</p>
                      <button onClick={() => setSelectedCity(null)} className="back-button">
                        Select Different City
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="saved-view">
                  <SavedList city={selectedCity} />
                </div>
              )}
            </main>
          </>
        )}
      </ProtectedRoute>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
