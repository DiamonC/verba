import OpenAI from 'openai';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const { text, options = {} } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const openai = new OpenAI({
      apiKey:  import.meta.env.VITE_OPENAI_KEY ,
    });

    // Default values for speech generation
    const defaultOptions = {
      model: 'gpt-4o-mini-tts',
      voice: 'shimmer',
      response_format: 'mp3'
    };
    
    const speechResponse = await openai.audio.speech.create({
      ...defaultOptions,
      ...options,
      input: text
    });
    
    // Get the audio as a buffer
    const buffer = Buffer.from(await speechResponse.arrayBuffer());
    
    // Return the audio file
    return new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.byteLength.toString()
      }
    });
    
  } catch (error) {
    console.error('OpenAI speech API error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate speech',
        details: error.response ? error.response.data : null
      }), 
      {
        status: error.status || 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}