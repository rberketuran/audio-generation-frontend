import { useState, useEffect } from 'react';
import { getCredits } from '../services/api';

const CreditsDisplay = ({ refreshTrigger }) => {
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCredits = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCredits();
      setCredits(data);
    } catch (err) {
      setError(err.detail || err.message || 'Failed to fetch credits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [refreshTrigger]);

  if (loading && !credits) {
    return <div className="credits-display">Loading credits...</div>;
  }

  if (error) {
    return <div className="credits-display error">Error</div>;
  }

  return (
    <div className="credits-display">
      <div className="credits-label">used/total</div>
      <div className="credits-numbers">
        <span className="credits-value">
          {credits?.remaining_credits !== null && credits?.remaining_credits !== undefined
            ? credits.remaining_credits.toLocaleString()
            : 'N/A'}
        </span>
        {credits?.total_credits && (
          <>
            <span className="credits-separator"> / </span>
            <span className="credits-total">{credits.total_credits.toLocaleString()}</span>
          </>
        )}
      </div>
      <div className="credits-word">credits</div>
    </div>
  );
};

export default CreditsDisplay;
