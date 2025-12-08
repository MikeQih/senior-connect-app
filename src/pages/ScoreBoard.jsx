import { useState, useEffect } from 'react';
import { getParticipantScores, getBestScores } from '../firebase/gameScores';

export default function ScoreBoard({ participantId }) {
  const [scores, setScores] = useState([]);
  const [bestScores, setBestScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);

        // Fetch all scores for the participant
        const allScores = await getParticipantScores(participantId);
        setScores(allScores);

        // Fetch best scores per level
        const best = await getBestScores(participantId, 'matching_pairs');
        setBestScores(best);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching scores:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (participantId) {
      fetchScores();
    }
  }, [participantId]);

  const formatTime = (seconds) => {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading scores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <p>Error loading scores: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Score Board - {participantId}</h1>

      {/* Best Scores Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Best Scores Per Level</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {[1, 2, 3, 4, 5].map(level => {
            const best = bestScores[level];
            return (
              <div
                key={level}
                style={{
                  border: '2px solid #4CAF50',
                  borderRadius: '8px',
                  padding: '15px',
                  backgroundColor: best ? '#f1f8f4' : '#f5f5f5'
                }}
              >
                <h3>Level {level}</h3>
                {best ? (
                  <>
                    <p><strong>Time:</strong> {formatTime(best.time)}</p>
                    <p><strong>Moves:</strong> {best.moves}</p>
                    <p style={{ fontSize: '12px', color: '#666' }}>
                      {formatDate(best.timestamp)}
                    </p>
                  </>
                ) : (
                  <p style={{ color: '#999' }}>Not played yet</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Scores Section */}
      <section>
        <h2>Recent Games ({scores.length})</h2>
        {scores.length === 0 ? (
          <p>No games played yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Level</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Time</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Moves</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score, index) => (
                  <tr
                    key={score.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9'
                    }}
                  >
                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                      Level {score.level}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                      {formatTime(score.time)}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                      {score.moves}
                    </td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                      {formatDate(score.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
