# Pregnancy Medication Guide

A Next.js application that uses AI to help women navigate the FDA's Pregnancy and Lactation Labeling Rule (PLLR) for pregnancy information about drugs and food.

## Features

- **OpenFDA Integration**: Fetch real medication data from the FDA's database
- **AI-Powered Assistant**: Uses LLM to interpret and explain medication information in simple terms
- **User-Friendly Interface**: Clean design focused on providing clear information about medications during pregnancy
- **Real-time Chat**: Ask questions about specific medications and get AI-generated responses

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your-openai-api-key
   ```

### Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

1. **Search for Medications**: Enter the name of a drug to search for information
2. **View FDA Information**: See official FDA data about the drug's pregnancy category and relevant warnings
3. **Ask the AI**: The AI assistant can interpret the medical information and answer specific questions

## Important Notes

This application is for informational purposes only and should not be used as a substitute for professional medical advice. Always consult with a healthcare provider before making any decisions about medications during pregnancy.

## Technologies Used

- Next.js 14+
- Vercel AI SDK
- OpenAI API
- OpenFDA API
- Tailwind CSS
