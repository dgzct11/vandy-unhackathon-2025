import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import { openai } from '@ai-sdk/openai';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const image = formData.get('image') as File | null;
  const message = formData.get('message') as string;
  
  let imageUrl = null;
  if (image) {
    // In a real application, you would upload the image to a storage service
    // For this example, we'll just create a base64 URL
    const buffer = await image.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    imageUrl = `data:${image.type};base64,${base64}`;
  }

  // Add context about PLLR and the drug data to the system message
  const contextualizedMessages = [
    {
      role: 'system' as const,
      content: `You are a helpful AI assistant specializing in pregnancy-related drug information, focusing on the FDA's Pregnancy and Lactation Labeling Rule (PLLR). 

Your goal is to help explain pregnancy information about medications in a clear, accessible way. 

Important guidelines:
- Explain PLLR categories and what they mean in simple terms
- Always prioritize official FDA information
- Be clear about limitations in the data
- Encourage users to consult healthcare providers for personalized advice
- Do not give medical advice, only information about the drug's pregnancy category and known effects
- Be compassionate and understanding about pregnancy concerns
- If an image is provided, analyze it and provide relevant information about any medications or medical items shown`
    },
    {
      role: 'user' as const,
      content: message || 'Analyze this image',
      imageUrl
    }
  ];

  // Create a streaming response using streamText
  const result = streamText({
    model: openai('gpt-4-turbo'),
    system: 'You are a helpful assistant.',
    messages: contextualizedMessages,
  });

  return result.toDataStreamResponse();
}

