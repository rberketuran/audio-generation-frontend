import { useState } from 'react';
import MusicPlayer from '../components/MusicPlayer';
import StatusPolling from '../components/StatusPolling';
import { uploadVoiceConversion } from '../services/api';
import './VoiceConversionPage.css';

function VoiceConversionPage() {
  const [jobId, setJobId] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Conversion parameters
  const [f0UpKey, setF0UpKey] = useState(0);
  const [indexRate, setIndexRate] = useState(0.75);
  const [rmsMixRate, setRmsMixRate] = useState(0.25);
  const [protect, setProtect] = useState(0.33);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/m4a', 'audio/ogg'];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(wav|mp3|m4a|ogg)$/i)) {
        setError('Please select a valid audio file (WAV, MP3, M4A, or OGG)');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an audio file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setJobId(null);
    setAudioUrl(null);

    try {
      const params = {
        f0_up_key: f0UpKey,
        f0_method: 'rmvpe',
        index_rate: indexRate,
        filter_radius: 3,
        rms_mix_rate: rmsMixRate,
        protect: protect,
        resample_sr: 0
      };

      const response = await uploadVoiceConversion(selectedFile, params);
      
      if (response.job_id) {
        setJobId(response.job_id);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      setError(err.detail || err.message || 'An error occurred while uploading audio');
      console.error('Error:', err);
      setIsLoading(false);
    }
  };

  const handleConversionComplete = (url) => {
    setAudioUrl(url);
    setIsLoading(false);
    setJobId(null);
  };

  const handleConversionError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
    setJobId(null);
  };

  return (
    <div className="voice-conversion-page">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>🎤 Voice Conversion</h1>
            <p>Convert voices using RVC (Retrieval-based Voice Conversion)</p>
          </div>
        </div>
      </header>

      <div className="content">
        <form onSubmit={handleSubmit} className="voice-conversion-form">
          <div className="form-group">
            <label htmlFor="audio-file" className="file-label">
              Select Audio File
            </label>
            <input
              type="file"
              id="audio-file"
              accept="audio/*"
              onChange={handleFileChange}
              className="file-input"
              disabled={isLoading}
            />
            {selectedFile && (
              <p className="file-info">Selected: {selectedFile.name}</p>
            )}
          </div>

          <div className="parameters-section">
            <h3>Conversion Parameters</h3>
            
            <div className="parameter-group">
              <label htmlFor="f0-up-key">
                Pitch Shift (semitones): {f0UpKey}
              </label>
              <input
                type="range"
                id="f0-up-key"
                min="-12"
                max="12"
                value={f0UpKey}
                onChange={(e) => setF0UpKey(parseInt(e.target.value))}
                className="slider"
                disabled={isLoading}
              />
              <small>Adjust pitch: -12 (lower octave) to +12 (higher octave)</small>
            </div>

            <div className="parameter-group">
              <label htmlFor="index-rate">
                Accent Strength: {(indexRate * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                id="index-rate"
                min="0"
                max="1"
                step="0.01"
                value={indexRate}
                onChange={(e) => setIndexRate(parseFloat(e.target.value))}
                className="slider"
                disabled={isLoading}
              />
              <small>Higher values increase accent strength (may cause artifacts if too high)</small>
            </div>

            <div className="parameter-group">
              <label htmlFor="rms-mix-rate">
                Volume Envelope: {(rmsMixRate * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                id="rms-mix-rate"
                min="0"
                max="1"
                step="0.01"
                value={rmsMixRate}
                onChange={(e) => setRmsMixRate(parseFloat(e.target.value))}
                className="slider"
                disabled={isLoading}
              />
              <small>Lower values mimic original volume, higher values = consistent loudness</small>
            </div>

            <div className="parameter-group">
              <label htmlFor="protect">
                Voiceless Protection: {(protect * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                id="protect"
                min="0"
                max="0.5"
                step="0.01"
                value={protect}
                onChange={(e) => setProtect(parseFloat(e.target.value))}
                className="slider"
                disabled={isLoading}
              />
              <small>Protects voiceless consonants and breath sounds (lower = more protection)</small>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading || !selectedFile}
          >
            {isLoading ? 'Processing...' : 'Convert Voice'}
          </button>
        </form>

        {error && (
          <div className="error-container">
            <p className="error-text">Error: {error}</p>
          </div>
        )}

        {jobId && (
          <StatusPolling
            taskId={jobId}
            onComplete={handleConversionComplete}
            onError={handleConversionError}
            type="voice-conversion"
          />
        )}

        {audioUrl && (
          <MusicPlayer 
            audioUrl={audioUrl}
            downloadName="voice-converted.mp3"
            title="Converted Voice"
          />
        )}
      </div>
    </div>
  );
}

export default VoiceConversionPage;
