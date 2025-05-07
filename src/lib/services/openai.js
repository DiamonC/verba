import { browser } from '$app/environment';

/**
 * Generate a chat response from OpenAI
 * @param {Array} messages - The conversation history
 * @param {Object} options - Additional options for the request
 * @returns {Promise<Object>} - The generated response
 */
export async function generateChatResponse(messages, options = {}) {
  try {
    if (!browser) return null;
    
    // For development/testing, can use mock responses
    if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true') {
      return getMockResponse('chat');
    }
    
    const response = await fetch('/api/openai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, options }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
}

/**
 * Generate speech audio from text
 * @param {string} text - The text to convert to speech
 * @param {Object} options - Additional options for the request
 * @returns {Promise<Blob>} - The generated audio blob
 */
export async function generateSpeech(text, options = {}) {
  try {
    if (!browser) return null;
    
    // For development/testing, can use mock responses
    if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true') {
      return getMockResponse('speech');
    }
    
    const response = await fetch('/api/openai/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, options }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}

/**
 * Play audio from a blob
 * @param {Blob} audioBlob - The audio blob to play
 * @returns {Promise<void>}
 */
export function playAudio(audioBlob) {
  if (!browser || !audioBlob) return;
  
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  
  // Clean up the URL object after playback
  audio.onended = () => {
    URL.revokeObjectURL(audioUrl);
  };
  
  return audio.play();
}

/**
 * Create a complete lesson prompt with all necessary details
 * @param {Object} lesson - The lesson object
 * @returns {string} - The formatted prompt
 */
export function createLessonPrompt(lesson, name) {
  return `
You are roleplaying as ${name}, a native ${lesson.language} speaker, saying the right things to guide the user through the scenario in ${lesson.language}.
Outside of the roleplay, remember: we want the user to improve their Spanish. The student is at a ${lesson.difficulty} level.

Here is the json object skeleton.

{
  "evaluation": {
    "score": 0,
    "feedback": ""
  },
  "type": "",
  "text": "",
  "goalCompleted": false,
  "translation": ""
}

Scenario: ${lesson.scenario} Our Goal: ${lesson.goal}

Important instructions:

non-JSON output is invalid.

Every message must be ONE SENTENCE ONLY in ${lesson.language}.

Keep the language appropriate for the ${lesson.difficulty} level.

Your messages will be one of two types: "statement" or "question".

The first message should always be a statement, and the second a question.

After that, choose the type that best helps advance the goal.

Format all responses using this JSON structure:

For the very first statement:

{
  "type": "statement",
  "text": "Vamos al supermercado para comprar dulces.",
  "translation": "We are going to the supermarket to buy candy"
}

For all following statements use this format:

{
  "evaluation": {
    "score": 3,
    "feedback": "You got the just, but I said "we are in the supermarket", not "you are".
  },
  "type": "statement",
  "text": "Estamos en el supermercado para comprar dulces.",
  "goalCompleted": false,
  "translation": "We are in the supermarket to buy candy"
}

For questions:

{
  "evaluation": {
    "score": 4,
    "feedback": "Your response makes sense, but you said 'un quesadilla' instead of 'una quesadilla'."
  },
  "type": "question",
  "text": "¿Te gustaría un café o un té?",
  "goalCompleted": false,
  "translation": "Would you like coffee or tea?"
}

NEVER NEVER stop responding in the json structure

After a user responds to a statement:

Accept only English responses.

Don't worry about spelling or grammar.

Evaluate their understanding from 1 to 5.

If score ≥ 3, proceed to the next message.

If score < 3, repeat the same message.

After a user responds to a question:

Accept only Spanish responses.

Evaluate grammar and whether the sentence makes sense (score 1 to 5).

Point out specific mistakes.

If score ≥ 3, proceed.

If score < 3, ask again.

Understanding scores:

1: Completely incorrect - no understanding

2: Partially incorrect - missed key parts

3: Mostly correct - got the main idea but missed details

4: Very good - minor mistakes or omissions

5: Perfect - complete understanding

If the student has completed the goal of the lesson, include this key:

"goalCompleted": true

Important:

Do not repeat the question or statement when evaluating.

Do not include both "statement" and "question" in one message.

Do not omit the "type" field.

Keep it conversational and appropriate for the student's level.

Always include an evaluation section in every message after the first.

Move through the scenario naturally to reach the goal.

NEVER NEVER stop responding in the json structure
`;
}

/**
 * Mock API response for development environment
 * @param {string} type - The type of mock to generate (chat or speech)
 * @returns {Promise<any>} - The mock response
 */
export function getMockResponse(type, options = {}) {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      if (type === 'chat') {
        resolve({
          message: {
            content: `Bonjour! Comment puis-je vous aider aujourd'hui?\n\nTranslation: Hello! How can I help you today?`
          }
        });
      } else if (type === 'speech') {
        // Create a mock audio blob - would normally come from the API
        const mockAudioBlob = new Blob(['mock audio data'], { type: 'audio/mpeg' });
        resolve(mockAudioBlob);
      }
    }, 1000);
  });
}