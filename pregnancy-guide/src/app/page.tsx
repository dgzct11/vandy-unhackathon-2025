'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import Image from 'next/image';

export default function Home() {
  const [drugName, setDrugName] = useState('');
  const [drugData, setDrugData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  // AI chat integration
  const { messages, input, handleInputChange, handleSubmit, isLoading} = useChat({
    api: '/api/chat',
    body: {
      drugData,
    },
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! I can help you understand how medications might affect pregnancy and breastfeeding. Start by searching for a medication above.',
      },
    ],
  });

  // Handle drug search
  const handleDrugSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!drugName.trim()) return;
    
    setIsSearching(true);
    setError('');
    
    try {
      const response = await fetch(`/api/openfda?drug=${encodeURIComponent(drugName)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch drug information');
      }
      
      if (data.results && data.results.length === 0) {
        setError('No information found for this medication. Try searching for a different name.');
        setDrugData(null);
      } else {
        setDrugData(data.results);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search for drug information');
      setDrugData(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-violet-50 dark:from-gray-900 dark:to-gray-800">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-violet-700 dark:text-violet-400">
            Pregnancy Medication Guide
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by AI & OpenFDA
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4 grid md:grid-cols-[1fr_1.5fr] gap-6 pt-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Search Medication
            </h2>
            <form onSubmit={handleDrugSearch} className="space-y-4">
              <div>
                <label htmlFor="drugName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Enter medication name
                </label>
                <input
                  type="text"
                  id="drugName"
                  value={drugName}
                  onChange={(e) => setDrugName(e.target.value)}
                  placeholder="e.g., Tylenol, acetaminophen"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !drugName.trim()}
                className="w-full py-2 px-4 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {drugData && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Medication Information
              </h2>
              <div className="space-y-4">
                {drugData.map((drug: any, index: number) => (
                  <div key={index} className="border-b last:border-0 pb-4 last:pb-0 pt-2 first:pt-0">
                    <p className="font-semibold text-violet-700 dark:text-violet-400">{drug.brandName} ({drug.genericName})</p>
                    
                    <div className="mt-2 space-y-2 text-sm">
                      {drug.pregnancyCategory && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Pregnancy Category: </span>
                          <span>{drug.pregnancyCategory}</span>
                        </div>
                      )}
                      
                      {drug.pregnancyInfo && drug.pregnancyInfo !== 'No specific pregnancy information available' && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Pregnancy Information: </span>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">{drug.pregnancyInfo.substring(0, 200)}...</p>
                        </div>
                      )}
                      
                      {drug.lactationInfo && drug.lactationInfo !== 'No specific lactation information available' && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Lactation Information: </span>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">{drug.lactationInfo.substring(0, 200)}...</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col h-[600px]">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            AI Pregnancy Assistant
          </h2>
          
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`p-3 rounded-lg ${
                  message.role === 'assistant' 
                    ? 'bg-violet-50 dark:bg-violet-900/20 text-gray-800 dark:text-gray-200' 
                    : 'bg-blue-50 dark:bg-blue-900/20 ml-auto text-gray-800 dark:text-gray-200'
                }`}
              >
                <p>{message.content}</p>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about this medication and pregnancy..."
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="py-2 px-4 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-8 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          This tool provides general information and is not a substitute for professional medical advice.
          Always consult with your healthcare provider for medical decisions during pregnancy.
        </p>
      </footer>
    </div>
  );
}
