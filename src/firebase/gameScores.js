import { db } from './config';
import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';

/**
 * Save a Matching Pairs game score to Firestore
 * @param {string} participantId - Backend participant ID
 * @param {number} level - Game level (1-5)
 * @param {number} moves - Number of moves taken
 * @param {number} time - Time taken in seconds
 * @returns {Promise<string>} - Document ID of the saved score
 */
export async function saveMatchingPairsScore(participantId, level, moves, time) {
  try {
    const scoreData = {
      participantId,
      gameType: 'matching_pairs',
      level,
      moves,
      time,
      timestamp: Timestamp.now(),
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'gameScores'), scoreData);
    console.log('Score saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving score:', error);
    throw error;
  }
}

/**
 * Get all scores for a specific participant
 * @param {string} participantId - Backend participant ID
 * @returns {Promise<Array>} - Array of score documents
 */
export async function getParticipantScores(participantId) {
  try {
    const q = query(
      collection(db, 'gameScores'),
      where('participantId', '==', participantId),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const scores = [];
    querySnapshot.forEach((doc) => {
      scores.push({ id: doc.id, ...doc.data() });
    });

    return scores;
  } catch (error) {
    console.error('Error fetching scores:', error);
    throw error;
  }
}

/**
 * Get all scores for a specific game type
 * @param {string} gameType - Type of game (e.g., 'matching_pairs')
 * @returns {Promise<Array>} - Array of score documents
 */
export async function getGameScores(gameType) {
  try {
    const q = query(
      collection(db, 'gameScores'),
      where('gameType', '==', gameType),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const scores = [];
    querySnapshot.forEach((doc) => {
      scores.push({ id: doc.id, ...doc.data() });
    });

    return scores;
  } catch (error) {
    console.error('Error fetching game scores:', error);
    throw error;
  }
}

/**
 * Get best scores for a participant for each level
 * @param {string} participantId - Backend participant ID
 * @param {string} gameType - Type of game
 * @returns {Promise<Object>} - Object with best scores per level
 */
export async function getBestScores(participantId, gameType = 'matching_pairs') {
  try {
    const q = query(
      collection(db, 'gameScores'),
      where('participantId', '==', participantId),
      where('gameType', '==', gameType)
    );

    const querySnapshot = await getDocs(q);
    const bestScores = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const level = data.level;

      if (!bestScores[level] || data.time < bestScores[level].time) {
        bestScores[level] = { id: doc.id, ...data };
      }
    });

    return bestScores;
  } catch (error) {
    console.error('Error fetching best scores:', error);
    throw error;
  }
}
