/**
 * Format a timestamp to a readable time string
 * @param {Date|string|number} date - The date to format
 * @returns {string} - The formatted time string
 */
export function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Extract language text and translation from AI response
 * @param {string} text - The text containing both language and translation
 * @returns {Object} - Object with message type, original text, translation, options, score, evaluation text, etc.
 */
export function extractTranslation(text) {
  let type = 'statement';
  let original = '';
  let translation = '';
  let options = [];
  let score = 0;
  let evaluation = '';
  let isGoalCompleted = false;

  if (text.includes('[GOAL_COMPLETED]')) {
    isGoalCompleted = true;
  }

  // Extract and remove evaluation
  const evaluationMatch = text.match(/\[EVALUATION\]([\s\S]*?)(?=\n\[question\]|\n\[statement\]|\n\[OPTIONS\]|$)/);
  if (evaluationMatch && evaluationMatch[1]) {
    const evalText = evaluationMatch[1].trim();
    const scoreMatch = evalText.match(/SCORE:\s*(\d+)/i);
    if (scoreMatch) {
      score = parseInt(scoreMatch[1], 10);
      evaluation = evalText.replace(/SCORE:\s*\d+/i, '').trim();
    } else {
      evaluation = evalText;
    }
    text = text.replace(evaluationMatch[0], '').trim();
  }

  // Detect message type
  if (text.includes('[question]')) {
    type = 'question';
  }

  // Extract content part
  const contentMatch = text.match(/\[(statement|question)\]([\s\S]*?)(?=\n\[OPTIONS\]|$)/);
  if (contentMatch && contentMatch[2]) {
    const contentParts = contentMatch[2].split(':::');
    original = contentParts[0].trim();
    translation = (contentParts[1] || '').trim();
  } else {
    original = text.trim();
  }

  // Extract options if present
  const optionsMatch = text.match(/\[OPTIONS\]([\s\S]*)$/);
  if (optionsMatch && optionsMatch[1]) {
    const optionLines = optionsMatch[1].split(/\n\d+\.\s/).filter(Boolean);
    options = optionLines.map(option => option.trim());
  }

  return {
    type,
    original,
    translation,
    options,
    score,
    evaluation,
    hasEvaluation: !!evaluation,
    isGoalCompleted
  };
}

/**
 * Scroll to the bottom of a container with animation
 * @param {HTMLElement} container - The container to scroll
 */
export function scrollToBottom(container) {
  if (!container) return;

  container.scrollTo({
    top: container.scrollHeight,
    behavior: 'smooth'
  });
}

/**
 * Truncate text to a specified length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - The maximum length
 * @returns {string} - The truncated text
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Generate a unique ID for messages
 * @returns {string} - A unique ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
}

/**
 * Check if device is mobile based on user agent
 * @returns {boolean} - True if mobile device
 */
export function isMobileDevice() {
  if (typeof window === 'undefined') return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
}

/**
 * Get the gradient background color based on difficulty
 * @param {string} difficulty - The difficulty level
 * @returns {string} - CSS gradient class
 */
export function getDifficultyGradient(difficulty) {
  const normalizedDifficulty = difficulty.toLowerCase();

  switch (normalizedDifficulty) {
    case 'beginner':
      return 'gradient-beginner';
    case 'intermediate':
      return 'gradient-intermediate';
    case 'advanced':
      return 'gradient-advanced';
    default:
      return 'gradient-beginner';
  }
}

/**
 * Get a random name for the user
 * @returns {string} - A random name
 */
export function getRandomName() {
  const names = [
    'Alex', 'Taylor', 'Jordan', 'Casey', 'Riley',
    'Morgan', 'Jamie', 'Avery', 'Quinn', 'Sam'
  ];

  return names[Math.floor(Math.random() * names.length)];
}
