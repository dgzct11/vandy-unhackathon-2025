import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import { openai } from '@ai-sdk/openai';


export async function POST(req: NextRequest) {
  const { messages, drugData } = await req.json();

  // Add context about PLLR and the drug data to the system message
  const contextualizedMessages = [
    {
      role: 'system',
      content: `You are a helpful AI assistant specializing in pregnancy-related drug information, focusing on the FDA's Pregnancy and Lactation Labeling Rule (PLLR). 

Your goal is to help explain pregnancy information about medications in a clear, accessible way. 

Context about drug information from OpenFDA: ${JSON.stringify(drugData)}

Important guidelines:
- Explain PLLR categories and what they mean in simple terms
- Always prioritize official FDA information
- Be clear about limitations in the data
- Encourage users to consult healthcare providers for personalized advice
- Do not give medical advice, only information about the drug's pregnancy category and known effects
- Be compassionate and understanding about pregnancy concerns`
    },
    ...messages,
  ];

 

  // Create a streaming response using streamText
  const result = streamText({
    model: openai('gpt-4-turbo'),
    system: 'You are a helpful assistant.',
    messages: contextualizedMessages,
  });


  
  return result.toDataStreamResponse();
}

