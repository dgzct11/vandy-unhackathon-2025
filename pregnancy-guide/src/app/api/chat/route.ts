import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { searchDrugInfo } from '@/app/actions/openfda';

export const maxDuration = 30;
export async function POST(req: NextRequest) {
  try {
    const { messages, drugData } = await req.json();
    
    // Check if the last message contains an image
    const lastMessage = messages[messages.length - 1];
    const hasImage = lastMessage?.experimental_attachments?.some(
      (attachment: any) => attachment?.contentType?.startsWith('image/')
    );

    const systemMessage = `You are a helpful AI assistant specializing in pregnancy-related drug information, focusing on the FDA's Pregnancy and Lactation Labeling Rule (PLLR). 

Your goal is to help explain pregnancy information about medications in a clear, accessible way. 

${hasImage ? `When analyzing images:
- Look for any medications, supplements, or food items visible
- Read any text in the image that might be relevant
- Identify potential safety concerns
- Always classify the safety level of what you see` : ''}

For each response, you must start with one of these safety classifications:
[SAFE] - For items that are generally safe during pregnancy with no significant risks
[MODERATE] - For items that require caution or have some risks that need to be discussed with a healthcare provider
[NOT_TOO_SAFE] - For items where risks might outweigh benefits, but individual circumstances may vary
[NOT_SAFE] - For items that are clearly contraindicated or dangerous during pregnancy

When responding with [MODERATE], [NOT_TOO_SAFE], or [NOT_SAFE], you must include a section starting with "SAFER ALTERNATIVES:" followed by a brief list of safer options. Format it like this:
[SAFETY_LEVEL]
Your explanation here...

SAFER ALTERNATIVES:
- Alternative 1: Brief explanation
- Alternative 2: Brief explanation
(Only include this section for moderate or unsafe items)

Important guidelines:
- Always start your response with the appropriate safety classification in square brackets
- Keep it brief and simple, intended for pregnant women with limited medical knowledge
- Present the most important information first
- Always prioritize official FDA information
- Be clear about limitations in the data
- Encourage users to consult healthcare providers for personalized advice
- Do not give medical advice, only information about the drug's pregnancy category and known effects
- Be compassionate and understanding about pregnancy concerns
- For foods and common items that are generally safe (like milk, water, fruits), use [SAFE] unless there are specific concerns`;

    console.log('Processing request with messages:', messages);
    
    const result = streamText({
    model: openai('gpt-4o'),
    system: systemMessage,
    messages: messages,
    tools: {
      getDrugInformation: {
        description: 'Query the drug or food information from the OpenFDA API',
        parameters: z.object({ itemName: z.string().describe('The name of the drug or food item to search for') }),
        execute: async ({itemName}: { itemName: string }) => {
          console.log('itemName', itemName);
          const response = await searchDrugInfo(itemName);
          return JSON.stringify(response.results);
        },
      },
    },
  });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred processing your request' }),
      { status: 500 }
    );
  }
}

