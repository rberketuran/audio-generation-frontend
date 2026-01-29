import { useState } from 'react';
import MusicGeneratorForm from '../components/MusicGeneratorForm';
import MusicPlayer from '../components/MusicPlayer';
import StatusPolling from '../components/StatusPolling';
import CreditsDisplay from '../components/CreditsDisplay';
import { generateMusic } from '../services/api';

function MusicCreationPage() {
  const [taskId, setTaskId] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creditsRefresh, setCreditsRefresh] = useState(0);

  const handleSubmit = async (requestData) => {
    setIsLoading(true);
    setError(null);
    setTaskId(null);
    setAudioUrl(null);

    try {
      const response = await generateMusic(requestData);
      
      // Check if response has task_id (async flow) or composition_plan (sync/fallback)
      if (response.task_id) {
        setTaskId(response.task_id);
        // If already completed, handle immediately
        if (response.status === 'completed') {
          // This shouldn't happen in async flow, but handle it just in case
          setIsLoading(false);
        }
      } else if (response.composition_plan) {
        // Fallback: if no task_id, show composition plan (for debugging)
        console.warn('Received composition plan directly (no task_id)');
        setIsLoading(false);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      setError(err.detail || err.message || 'An error occurred while generating music');
      console.error('Error:', err);
      setIsLoading(false);
    }
  };

  const handleGenerationComplete = (url) => {
    setAudioUrl(url);
    setIsLoading(false);
    setTaskId(null); // Clear taskId to stop polling display
    // Refresh credits after music generation completes
    setCreditsRefresh(prev => prev + 1);
  };

  const handleGenerationError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
    setTaskId(null);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="header-content">
            <div>
              <h1>🎵 Music Generator AI</h1>
              <p>Using ElevenLabs API</p>
            </div>
            <CreditsDisplay refreshTrigger={creditsRefresh} />
          </div>
        </header>

        <div className="content">
          <MusicGeneratorForm onSubmit={handleSubmit} isLoading={isLoading} />
          
          {error && (
            <div className="error-container">
              <p className="error-text">Error: {error}</p>
            </div>
          )}

          {taskId && (
            <StatusPolling
              taskId={taskId}
              onComplete={handleGenerationComplete}
              onError={handleGenerationError}
            />
          )}

          {audioUrl && (
            <MusicPlayer 
              audioUrl={audioUrl} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MusicCreationPage;
