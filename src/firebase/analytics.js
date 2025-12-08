import { logEvent } from 'firebase/analytics';
import { analytics } from './config';

/**
 * Log when a game is started
 * @param {string} gameType - Type of game (e.g., 'matching_pairs', 'connect4')
 * @param {number} level - Game level
 * @param {string} participantId - Participant ID
 */
export function logGameStart(gameType, level, participantId) {
  if (!analytics) return;

  logEvent(analytics, 'game_start', {
    game_type: gameType,
    level: level,
    participant_id: participantId
  });
}

/**
 * Log when a game is completed
 * @param {string} gameType - Type of game
 * @param {number} level - Game level
 * @param {number} moves - Number of moves
 * @param {number} time - Time in seconds
 * @param {string} participantId - Participant ID
 */
export function logGameComplete(gameType, level, moves, time, participantId) {
  if (!analytics) return;

  logEvent(analytics, 'game_complete', {
    game_type: gameType,
    level: level,
    moves: moves,
    time_seconds: time,
    participant_id: participantId
  });
}

/**
 * Log when a level is failed or abandoned
 * @param {string} gameType - Type of game
 * @param {number} level - Game level
 * @param {string} reason - Reason for exit ('quit', 'timeout', etc.)
 * @param {string} participantId - Participant ID
 */
export function logGameExit(gameType, level, reason, participantId) {
  if (!analytics) return;

  logEvent(analytics, 'game_exit', {
    game_type: gameType,
    level: level,
    exit_reason: reason,
    participant_id: participantId
  });
}

/**
 * Log page views
 * @param {string} pageName - Name of the page
 */
export function logPageView(pageName) {
  if (!analytics) return;

  logEvent(analytics, 'page_view', {
    page_name: pageName,
    page_location: window.location.href,
    page_path: window.location.pathname
  });
}

/**
 * Log user interactions
 * @param {string} actionType - Type of interaction (e.g., 'button_click', 'card_flip')
 * @param {string} elementName - Name of the element
 * @param {object} additionalData - Any additional data
 */
export function logUserInteraction(actionType, elementName, additionalData = {}) {
  if (!analytics) return;

  logEvent(analytics, 'user_interaction', {
    action_type: actionType,
    element_name: elementName,
    ...additionalData
  });
}

/**
 * Log when a level is completed successfully
 * @param {string} gameType - Type of game
 * @param {number} level - Game level completed
 * @param {string} participantId - Participant ID
 */
export function logLevelComplete(gameType, level, participantId) {
  if (!analytics) return;

  logEvent(analytics, 'level_complete', {
    game_type: gameType,
    level: level,
    participant_id: participantId
  });
}

/**
 * Log custom events
 * @param {string} eventName - Name of the event
 * @param {object} eventParams - Event parameters
 */
export function logCustomEvent(eventName, eventParams = {}) {
  if (!analytics) return;

  logEvent(analytics, eventName, eventParams);
}
