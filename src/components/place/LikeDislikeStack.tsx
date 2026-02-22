import { useState, useEffect } from 'react';
import { Place } from '../../types';
import { PlaceCard } from './PlaceCard';
import { addLike } from '../../services/likesService';
import { useAuth } from '../../contexts/AuthContext';
import './LikeDislikeStack.css';

interface LikeDislikeStackProps {
  places: Place[];
  city: string;
  onComplete?: () => void;
}

export function LikeDislikeStack({ places, city, onComplete }: LikeDislikeStackProps) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentPlace = places[currentIndex];
  const hasMorePlaces = currentIndex < places.length - 1;

  const handleAction = async (action: 'like' | 'dislike') => {
    if (!user || !currentPlace || isProcessing) return;

    setIsProcessing(true);

    try {
      if (action === 'like') {
        await addLike(currentPlace.placeId, city, user.id);
      }
      // For dislike, we just skip (no action needed)

      // Move to next card
      if (hasMorePlaces) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // All places processed
        onComplete?.();
      }
    } catch (error) {
      console.error('Error processing action:', error);
      // Still advance even on error
      if (hasMorePlaces) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onComplete?.();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!currentPlace) {
    return (
      <div className="like-dislike-stack-empty">
        <p>No more places to discover!</p>
        <button onClick={onComplete} className="view-saved-button">
          View Saved Places
        </button>
      </div>
    );
  }

  return (
    <div className="like-dislike-stack">
      <div className="stack-progress">
        <span>{currentIndex + 1} / {places.length}</span>
      </div>

      <div className="stack-card-container">
        <PlaceCard place={currentPlace} />
      </div>

      <div className="stack-actions">
        <button
          className="action-button dislike-button"
          onClick={() => handleAction('dislike')}
          disabled={isProcessing}
          aria-label="Dislike"
        >
          ✕
        </button>
        <button
          className="action-button like-button"
          onClick={() => handleAction('like')}
          disabled={isProcessing}
          aria-label="Like"
        >
          ♥
        </button>
      </div>

      {isProcessing && (
        <div className="processing-overlay">
          <div className="processing-spinner"></div>
        </div>
      )}
    </div>
  );
}
