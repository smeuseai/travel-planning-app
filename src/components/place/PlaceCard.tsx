import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Place } from '../../types';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './PlaceCard.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';

interface PlaceCardProps {
  place: Place;
}

// ~4 sentences ≈ 600 characters
const MIN_DESCRIPTION_LENGTH = 600;

export function PlaceCard({ place }: PlaceCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const description = place.description?.trim() || 'No description available.';
  const shouldTruncate = description.length > MIN_DESCRIPTION_LENGTH;
  const displayDescription = showFullDescription || !shouldTruncate
    ? description
    : description.substring(0, MIN_DESCRIPTION_LENGTH) + '...';

  const imageUrls = place.imageUrls?.length
    ? place.imageUrls
    : [FALLBACK_IMAGE];

  const getImageUrl = (url: string, index: number) =>
    failedImages.has(index) ? FALLBACK_IMAGE : url;

  const handleImageError = (index: number) => {
    setFailedImages((prev) => new Set(prev).add(index));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Hungry':
        return '#ff6b6b';
      case 'Sight Seeing':
        return '#4ecdc4';
      case 'Shopping':
        return '#ffe66d';
      default:
        return '#95a5a6';
    }
  };

  const getScoreColor = (scoreCategory: string) => {
    switch (scoreCategory) {
      case 'Popular':
        return '#667eea';
      case 'Under-rated':
        return '#f093fb';
      default:
        return '#95a5a6';
    }
  };

  return (
    <div className="place-card">
      {/* Image Carousel */}
      <div className="place-card-carousel">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={0}
          slidesPerView={1}
        >
          {imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <img
                src={getImageUrl(url, index)}
                alt={`${place.name} - Image ${index + 1}`}
                className="place-image"
                onError={() => handleImageError(index)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Card Content - always visible below the carousel */}
      <div className="place-card-content">
        <h2 className="place-name">{place.name || 'Unnamed place'}</h2>

        {/* Rating and Popular/Under-rated always shown */}
        <div className="place-rating-row">
          <div className="place-rating">
            <span className="rating-value">⭐ {Number(place.rating).toFixed(1)}</span>
            <span className="rating-count">({place.user_ratings_total ?? 0} reviews)</span>
          </div>
          <span
            className="badge score-badge"
            style={{ backgroundColor: getScoreColor(place.scoreCategory ?? 'Popular') }}
          >
            {place.scoreCategory === 'Under-rated' ? 'Under-rated' : 'Popular'}
          </span>
        </div>

        {/* Category badge */}
        <div className="place-badges">
          <span
            className="badge category-badge"
            style={{ backgroundColor: getCategoryColor(place.category) }}
          >
            {place.category}
          </span>
        </div>

        {/* Description - larger write-up */}
        <p className="place-description">{displayDescription}</p>
        {shouldTruncate && (
          <button
            className="read-more-button"
            onClick={() => setShowFullDescription(!showFullDescription)}
          >
            {showFullDescription ? 'Read less' : 'Read more'}
          </button>
        )}

        {/* Discover more link - only when place has a website */}
        {place.website && (
          <a
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            className="discover-more-link"
          >
            Discover more →
          </a>
        )}
      </div>
    </div>
  );
}
