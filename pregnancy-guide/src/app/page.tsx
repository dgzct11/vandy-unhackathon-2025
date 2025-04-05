"use client";

import { useState } from "react";
import { useChat, Message } from "@ai-sdk/react";
import Image from "next/image";

// Extend the Message type from @ai-sdk/react
interface ExtendedMessage extends Message {
  imageUrl?: string;
}

// Extend the UIMessage type from @ai-sdk/react
declare module '@ai-sdk/react' {
  interface UIMessage {
    imageUrl?: string;
  }
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // AI chat integration
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleChatSubmit,
    isLoading,
    append,
  } = useChat({
    api: "/api/chat",
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
      const file = e.target.files[0];
      setSelectedImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImage) {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('message', input);
      
      try {
        // First, append the user's message with image to the chat
        const userMessage: ExtendedMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: input,
          imageUrl: imagePreview || undefined
        };
        await append(userMessage);

        // Then send the request to the API
        const response = await fetch('/api/chat', {
          method: 'POST',
          body: formData,
        });
        
        // Clear the input and image preview
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
        setSelectedImage(null);
        handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
        
        // Handle the streaming response
        const reader = response.body?.getReader();
        if (reader) {
          // The streaming response will be handled by useChat
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      handleChatSubmit(e);
    }
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
                {message.content && <p className="mb-2">{message.content}</p>}
                {(message as ExtendedMessage).imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={(message as ExtendedMessage).imageUrl} 
                      alt="User uploaded image" 
                      className="max-w-[300px] h-auto rounded-md"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {imagePreview && (
            <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-md relative inline-block">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-w-[200px] h-auto rounded-md"
              />
              <button
                onClick={() => {
                  URL.revokeObjectURL(imagePreview);
                  setImagePreview(null);
                  setSelectedImage(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                title="Remove image"
              >
                ×
              </button>
            </div>
          )}

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
