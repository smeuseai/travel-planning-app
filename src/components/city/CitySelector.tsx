import { useState } from 'react';
import './CitySelector.css';

// Popular cities list - can be expanded
const POPULAR_CITIES = [
  'New York, NY, USA',
  'Los Angeles, CA, USA',
  'Chicago, IL, USA',
  'San Francisco, CA, USA',
  'Miami, FL, USA',
  'Seattle, WA, USA',
  'Boston, MA, USA',
  'Washington, DC, USA',
  'London, UK',
  'Paris, France',
  'Tokyo, Japan',
  'Sydney, Australia',
  'Toronto, Canada',
  'Berlin, Germany',
  'Barcelona, Spain',
  'Rome, Italy',
  'Amsterdam, Netherlands',
  'Dubai, UAE',
  'Singapore',
  'Hong Kong',
];

interface CitySelectorProps {
  onCitySelect: (city: string) => void;
  selectedCity?: string;
}

export function CitySelector({ onCitySelect, selectedCity }: CitySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredCities = POPULAR_CITIES.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCityClick = (city: string) => {
    onCitySelect(city);
    setSearchTerm(city);
    setShowDropdown(false);
  };

  return (
    <div className="city-selector">
      <h2>Select a City</h2>
      <div className="city-input-wrapper">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search for a city..."
          className="city-input"
        />
        {showDropdown && filteredCities.length > 0 && (
          <div className="city-dropdown">
            {filteredCities.map((city) => (
              <div
                key={city}
                onClick={() => handleCityClick(city)}
                className={`city-option ${selectedCity === city ? 'selected' : ''}`}
              >
                {city}
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedCity && (
        <div className="selected-city-badge">
          Selected: <strong>{selectedCity}</strong>
        </div>
      )}
    </div>
  );
}
