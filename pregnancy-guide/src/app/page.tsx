"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import Image from "next/image";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // AI chat integration
  const { messages, input, handleInputChange, handleSubmit, isLoading} = useChat({
    maxSteps: 5,
    api: '/api/chat',
    body: {
      drugData,
    },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I can help you understand how medications might affect pregnancy and breastfeeding. Feel free to ask any questions!",
      },
    ],
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImage) {
      // TODO: Handle image upload
      setSelectedImage(null);
    }
    handleChatSubmit(e);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-violet-50 dark:from-gray-900 dark:to-gray-800">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-violet-700 dark:text-violet-400">
            MamaShield 
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by AI & OpenFDA
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col h-[600px]">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            AI Pregnancy Assistant
          </h2>

          <div className="flex-1 overflow-y-auto mb-4 space-y-4 flex flex-col">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg max-w-[80%] ${
                  message.role === "assistant"
                    ? "bg-violet-50 dark:bg-violet-900/20 text-gray-800 dark:text-gray-200 self-start"
                    : "bg-blue-50 dark:bg-blue-900/20 text-gray-800 dark:text-gray-200 self-end"
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
              placeholder="Ask about pregnancy and medications..."
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white"
            />
            <label
              className="cursor-pointer p-2 bg-violet-100 hover:bg-violet-200 dark:bg-violet-900/30 dark:hover:bg-violet-900/50 rounded-md transition-colors"
              title="Upload an image to share with the AI assistant"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-violet-600 dark:text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </label>
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className="py-2 px-4 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Send your message to the AI assistant"
            >
              {isLoading ? "..." : "Send"}
            </button>
          </form>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-8 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          This tool provides general information and is not a substitute for
          professional medical advice. Always consult with your healthcare
          provider for medical decisions during pregnancy.
        </p>
      </footer>
    </div>
  );
}
