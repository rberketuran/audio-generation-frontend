import { useState } from 'react';

const MusicGeneratorForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    is_instrumental: false,
    vocal_gender: 'male',
    lyrics: '',
    style: '',
    duration_seconds: 30,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'is_instrumental') {
      setFormData({
        ...formData,
        is_instrumental: checked,
        vocal_gender: checked ? null : (formData.vocal_gender || 'male'),
        lyrics: checked ? '' : formData.lyrics,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'number' ? parseInt(value) : value,
      });
    }
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.style.trim()) {
      newErrors.style = 'Music style is required';
    }
    
    if (!formData.is_instrumental) {
      if (!formData.vocal_gender) {
        newErrors.vocal_gender = 'Vocal gender is required when not instrumental';
      }
      if (!formData.lyrics.trim()) {
        newErrors.lyrics = 'Lyrics are required when not instrumental';
      } else if (formData.lyrics.length > 200) {
        newErrors.lyrics = 'Lyrics must be 200 characters or less';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const requestData = {
      is_instrumental: formData.is_instrumental,
      vocal_gender: formData.is_instrumental ? null : formData.vocal_gender,
      lyrics: formData.is_instrumental ? null : formData.lyrics.trim(),
      style: formData.style.trim(),
      duration_seconds: formData.duration_seconds,
    };

    onSubmit(requestData);
  };

  return (
    <form onSubmit={handleSubmit} className="music-form">
      <h2>Music Generation Preferences</h2>
      
      {/* Instrumental Toggle */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="is_instrumental"
            checked={formData.is_instrumental}
            onChange={handleChange}
          />
          <span>Instrumental (no vocals)</span>
        </label>
      </div>

      {/* Vocal Gender Selection (if not instrumental) */}
      {!formData.is_instrumental && (
        <div className="form-group">
          <label>Vocal Gender:</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="vocal_gender"
                value="male"
                checked={formData.vocal_gender === 'male'}
                onChange={handleChange}
              />
              <span>Male Vocal</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="vocal_gender"
                value="female"
                checked={formData.vocal_gender === 'female'}
                onChange={handleChange}
              />
              <span>Female Vocal</span>
            </label>
          </div>
          {errors.vocal_gender && <span className="error-message">{errors.vocal_gender}</span>}
        </div>
      )}

      {/* Lyrics Input (if not instrumental) */}
      {!formData.is_instrumental && (
        <div className="form-group">
          <label htmlFor="lyrics">
            Lyrics (max 200 characters):
            <span className="char-count">
              {formData.lyrics.length}/200
            </span>
          </label>
          <textarea
            id="lyrics"
            name="lyrics"
            value={formData.lyrics}
            onChange={handleChange}
            rows="4"
            maxLength={200}
            placeholder="Enter your lyrics here..."
            className={errors.lyrics ? 'error' : ''}
          />
          {errors.lyrics && <span className="error-message">{errors.lyrics}</span>}
        </div>
      )}

      {/* Music Style */}
      <div className="form-group">
        <label htmlFor="style">
          Music Style (comma-separated):
        </label>
        <input
          id="style"
          type="text"
          name="style"
          value={formData.style}
          onChange={handleChange}
          placeholder="e.g., 50s soul, saxophone, drums"
          className={errors.style ? 'error' : ''}
        />
        {errors.style && <span className="error-message">{errors.style}</span>}
      </div>

      {/* Duration */}
      <div className="form-group">
        <label htmlFor="duration">
          Duration: {formData.duration_seconds} seconds
        </label>
        <input
          id="duration"
          type="range"
          name="duration_seconds"
          min="5"
          max="60"
          value={formData.duration_seconds}
          onChange={handleChange}
        />
        <div className="duration-labels">
          <span>5s</span>
          <span>60s</span>
        </div>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="submit-button"
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Music'}
      </button>
    </form>
  );
};

export default MusicGeneratorForm;
