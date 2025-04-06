# Pregnancy Guide AI Assistant

This is an AI-powered chat application that provides information about medication and food safety during pregnancy.

## Setup Instructions

1. First, clone this repository
2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
   - Create a `.env.local` file in the root directory
   - Add your OpenAI API key and model configuration:
   ```
   OPENAI_API_KEY=your_api_key_here
   OPENAI_API_MODEL=gpt-4
   ```
   
   To get your OpenAI API key:
   1. Go to https://platform.openai.com/api-keys
   2. Sign in or create an account
   3. Create a new API key
   4. Copy the key and paste it in your `.env.local` file

   ⚠️ IMPORTANT: 
   - Never commit your `.env.local` file to version control
   - Keep your API key secret and don't share it publicly
   - If you accidentally expose your API key, rotate it immediately on OpenAI's website

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- Chat interface for pregnancy-related questions
- Safety indicator for medications and foods
- Integration with FDA database
- Real-time responses with GPT-4

## Usage

Simply type your question about pregnancy safety in the chat interface. For example:
- "Can I drink coffee while pregnant?"
- "Is it safe to take acetaminophen during pregnancy?"
- "What foods should I avoid while pregnant?"

The AI will respond with safety information and the safety indicator will show the risk level.

## Important Notes

This application is for informational purposes only and should not be used as a substitute for professional medical advice. Always consult with a healthcare provider before making any decisions about medications during pregnancy.

## Technologies Used

- Next.js 14+
- Vercel AI SDK
- OpenAI API
- OpenFDA API
- Tailwind CSS
