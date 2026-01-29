import { useEffect, useState } from 'react';
import { checkStatus, downloadMusic, getVoiceConversionStatus, downloadVoiceConversion } from '../services/api';

const StatusPolling = ({ taskId, onComplete, onError, type = 'music' }) => {
  const [status, setStatus] = useState('pending');
  const [progress, setProgress] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!taskId) return;

    let pollCount = 0;
    const maxPolls = 150; // Max 5 minutes (150 * 2 seconds)
    
    const pollInterval = setInterval(async () => {
      pollCount++;
      
      // Stop polling after max attempts
      if (pollCount > maxPolls) {
        clearInterval(pollInterval);
        onError('Polling timeout - music generation is taking longer than expected');
        return;
      }

      try {
        // Use appropriate API functions based on type
        const statusFn = type === 'voice-conversion' ? getVoiceConversionStatus : checkStatus;
        const response = await statusFn(taskId);
        setStatus(response.status);
        setProgress(response.progress);
        setMessage(response.message || '');

        if (response.status === 'completed') {
          clearInterval(pollInterval);
          try {
            // Download audio using appropriate endpoint
            const downloadFn = type === 'voice-conversion' ? downloadVoiceConversion : downloadMusic;
            const audioBlob = await downloadFn(taskId);
            const audioUrl = URL.createObjectURL(audioBlob);
            onComplete(audioUrl);
          } catch (downloadError) {
            onError(downloadError.message || 'Failed to download audio');
          }
        } else if (response.status === 'failed') {
          clearInterval(pollInterval);
          const errorMsg = type === 'voice-conversion' ? 'Voice conversion failed' : 'Music generation failed';
          onError(response.message || errorMsg);
        }
      } catch (error) {
        clearInterval(pollInterval);
        const errorMessage = error.detail || error.message || 'Failed to check status';
        onError(errorMessage);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [taskId, onComplete, onError, type]);

  const getStatusDisplay = () => {
    const isVoiceConversion = type === 'voice-conversion';
    switch (status) {
      case 'pending':
        return isVoiceConversion ? '⏳ Starting voice conversion...' : '⏳ Starting music generation...';
      case 'processing':
        return isVoiceConversion ? '🎤 Converting voice...' : '🎵 Generating your music...';
      case 'completed':
        return isVoiceConversion ? '✅ Voice conversion completed!' : '✅ Music generation completed!';
      case 'failed':
        return isVoiceConversion ? '❌ Voice conversion failed' : '❌ Generation failed';
      default:
        return `Status: ${status}`;
    }
  };

  return (
    <div className="status-polling">
      <div className="status-info">
        <p className="status-text">{getStatusDisplay()}</p>
        {message && <p className="status-message">{message}</p>}
        {progress !== null && progress !== undefined && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{Math.round(progress)}%</span>
          </div>
        )}
        {status === 'processing' && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPolling;
