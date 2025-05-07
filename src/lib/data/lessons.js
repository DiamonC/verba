import { browser } from '$app/environment';

// Default target language for the entire app
export const DEFAULT_LANGUAGE = 'Spanish';

/**
 * Sample lesson data - all in Spanish
 */
export const lessons = [
  {
    id: 'cafe-ordering',
    title: 'Ordering at a Café',
    description: 'Learn how to order food and drinks at a café or restaurant.',
    difficulty: 'superbeginnersokeepitto2or3words',
    language: 'Spanish',
    estimatedMinutes: 5,
    scenario: 'You are at a café in Madrid and want to order something to eat and drink.',
    goal: 'Successfully order a meal and understand the server\'s responses.'
  },
  {
    id: 'train-station',
    title: 'At the Train Station',
    description: 'Learn how to buy tickets and navigate a train station.',
    difficulty: 'intermediate',
    language: 'Spanish',
    estimatedMinutes: 8,
    scenario: 'You are at a busy train station in Barcelona and need to buy tickets for your journey.',
    goal: 'Purchase the correct tickets and find your platform.'
  },
  {
    id: 'business-meeting',
    title: 'Business Meeting',
    description: 'Learn how to participate in a business meeting and discuss project updates.',
    difficulty: 'advanced',
    language: 'Spanish',
    estimatedMinutes: 10,
    scenario: 'You are attending a business meeting with colleagues to discuss a new project.',
    goal: 'Introduce yourself, discuss your ideas, and understand others\' contributions.'
  },
  {
    id: 'grocery-shopping',
    title: 'Grocery Shopping',
    description: 'Learn how to shop for groceries and interact with store employees.',
    difficulty: 'beginner',
    language: 'Spanish',
    estimatedMinutes: 6,
    scenario: 'You are shopping for ingredients to make dinner at a local grocery store.',
    goal: 'Get the user to decide what what there going to make for dinner, make a shopping list, tell them theyre at the store now, and have them check the items out.'
  },
  {
    id: 'doctor-visit',
    title: 'Doctor\'s Appointment',
    description: 'Learn how to describe symptoms and understand medical advice.',
    difficulty: 'intermediate',
    language: 'Spanish',
    estimatedMinutes: 9,
    scenario: 'You are visiting a doctor because you have been feeling unwell.',
    goal: 'Explain your symptoms and understand the doctor\'s diagnosis and instructions.'
  },
  {
    id: 'hotel-checkin',
    title: 'Hotel Check-in',
    description: 'Learn how to check in to a hotel and request amenities.',
    difficulty: 'beginner',
    language: 'Spanish',
    estimatedMinutes: 5,
    scenario: 'You have just arrived at your hotel in Valencia after a long journey and need to check in.',
    goal: 'Complete the check-in process and ask about hotel facilities.'
  }
];

/**
 * Get a lesson by ID
 * @param {string} id - The lesson ID to find
 * @returns {Object|null} - The lesson object or null if not found
 */
export function getLessonById(id) {
  return lessons.find(lesson => lesson.id === id) || null;
}

/**
 * Get user's completed lessons from localStorage
 * @returns {Object} - Object with lesson IDs as keys and completion dates as values
 */
export function getCompletedLessons() {
  if (!browser) return {};
  
  try {
    const stored = localStorage.getItem('completed_lessons');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error getting completed lessons:', error);
    return {};
  }
}

/**
 * Save a completed lesson to localStorage
 * @param {string} lessonId - The ID of the completed lesson
 */
export function saveCompletedLesson(lessonId) {
  if (!browser) return;
  
  try {
    const completed = getCompletedLessons();
    completed[lessonId] = new Date().toISOString();
    localStorage.setItem('completed_lessons', JSON.stringify(completed));
  } catch (error) {
    console.error('Error saving completed lesson:', error);
  }
}

/**
 * Check if a lesson has been completed
 * @param {string} lessonId - The lesson ID to check
 * @returns {boolean} - True if lesson has been completed
 */
export function isLessonCompleted(lessonId) {
  const completed = getCompletedLessons();
  return !!completed[lessonId];
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