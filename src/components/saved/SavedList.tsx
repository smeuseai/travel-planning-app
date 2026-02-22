import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getLikesByCity, removeLike } from '../../services/likesService';
import { LikedPlace } from '../../types';
import { PlaceCard } from '../place/PlaceCard';
import { getPlaces } from '../../services/placesApi';
import { Place } from '../../types';
import './SavedList.css';

interface SavedListProps {
  city: string;
}

export function SavedList({ city }: SavedListProps) {
  const { user } = useAuth();
  const [likedPlaces, setLikedPlaces] = useState<LikedPlace[]>([]);
  const [placesData, setPlacesData] = useState<Map<string, Place>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !city) return;

    const fetchLikes = async () => {
      try {
        setLoading(true);
        const likes = await getLikesByCity(user.id, city);
        setLikedPlaces(likes);

        // Fetch place details for each liked place
        const allPlaces = await getPlaces(city);
        const placesMap = new Map<string, Place>();
        allPlaces.forEach(place => {
          placesMap.set(place.placeId, place);
        });
        setPlacesData(placesMap);
      } catch (err: any) {
        setError(err.message || 'Failed to load saved places');
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [user, city]);

  const handleRemove = async (likeId: string) => {
    try {
      await removeLike(likeId);
      setLikedPlaces(prev => prev.filter(like => like.id !== likeId));
    } catch (err: any) {
      console.error('Error removing like:', err);
      alert('Failed to remove place. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="saved-list-loading">
        <div className="spinner"></div>
        <p>Loading your saved places...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="saved-list-error">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (likedPlaces.length === 0) {
    return (
      <div className="saved-list-empty">
        <h2>No Saved Places Yet</h2>
        <p>Start exploring places in {city} and like the ones you want to visit!</p>
      </div>
    );
  }

  return (
    <div className="saved-list">
      <div className="saved-list-header">
        <h2>Your Saved Places in {city}</h2>
        <p className="saved-count">{likedPlaces.length} {likedPlaces.length === 1 ? 'place' : 'places'} saved</p>
      </div>

      <div className="saved-places-grid">
        {likedPlaces.map((likedPlace) => {
          const place = placesData.get(likedPlace.place_id);
          if (!place) {
            return (
              <div key={likedPlace.id} className="saved-place-item">
                <p>Place ID: {likedPlace.place_id}</p>
                <button
                  onClick={() => handleRemove(likedPlace.id)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            );
          }

          return (
            <div key={likedPlace.id} className="saved-place-item">
              <PlaceCard place={place} />
              <button
                onClick={() => handleRemove(likedPlace.id)}
                className="remove-button"
              >
                Remove from Saved
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
