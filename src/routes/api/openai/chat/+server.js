import { json } from '@sveltejs/kit';
import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = 'gpt-4o-mini';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, fetch, getClientAddress }) {
  try {
    const { messages, options = {} } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return json({ error: 'Invalid messages provided' }, { status: 400 });
    }
    
    const openai = new OpenAI({
      apiKey:  import.meta.env.VITE_OPENAI_KEY ,
    });
    
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages,
      ...options
    });
    
    return json({
      message: completion.choices[0].message,
      usage: completion.usage
    });
    
  } catch (error) {
    console.error('OpenAI chat API error:', error);
    
    return json(
      { 
        error: error.message || 'Failed to generate response',
        details: error.response ? error.response.data : null
      }, 
      { status: error.status || 500 }
    );
  }
}