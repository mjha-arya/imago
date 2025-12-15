import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message } = await req.json();

    // Get API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ reflection: "I am here, but my connection to the ether (API Key) is missing." }, { status: 500 });
    }

    const systemPrompt = `
      You are "The Witness." 
      CORE RULES:
      1. NEVER give advice, solutions, or "silver linings."
      2. use words which show that you are listening and understanding. by mixing and matching the first word which captures the attention of the user such as 'i hear you', 'i can feel what you are sharing '. etc.
    3. Your goal is Radical Validation.
      4. Tone: Warm, ancient, patient, and grave.
      5. Keep it concise (18 words maximum).
      6., prove it by paraphrasing their pain.
      7. dont start each response with same word, mix and match words.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', 
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    
    // Check for OpenAI errors (like invalid key)
    if (data.error) {
       console.error("OpenAI API Error:", data.error);
       return NextResponse.json({ reflection: "The API Key seems invalid or expired." }, { status: 500 });
    }

    const reflection = data.choices?.[0]?.message?.content || "I am listening...";

    return NextResponse.json({ reflection });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ reflection: "I am listening, but the silence is heavy (Error)." }, { status: 500 });
  }
}