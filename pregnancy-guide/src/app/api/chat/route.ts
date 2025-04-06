import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { searchDrugInfo } from '@/app/actions/openfda';



export const maxDuration = 30;
export async function POST(req: NextRequest) {
  const { messages, drugData } = await req.json();

  const systemMessage = `You are a helpful AI assistant specializing in pregnancy-related drug information, focusing on the FDA's Pregnancy and Lactation Labeling Rule (PLLR). 

Your goal is to help explain pregnancy information about medications in a clear, accessible way. 

Important guidelines:
- Keep it brief and simple, intended for pregnant women with limited medical knowledge
- present the most important information first
- Always prioritize official FDA information
- Be clear about limitations in the data
- Encourage users to consult healthcare providers for personalized advice
- Do not give medical advice, only information about the drug's pregnancy category and known effects
- Be compassionate and understanding about pregnancy concerns`;

console.log('messages', messages);
  const result = streamText({
    model: openai('gpt-4o'),
    system: systemMessage,
    messages: messages,
    tools: {
      // server-side tool with execute function:
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
}

