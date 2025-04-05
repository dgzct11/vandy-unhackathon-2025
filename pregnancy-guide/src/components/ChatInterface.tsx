import { UseTypedChatHelpers } from "@ai-sdk/react";
import { formatMessage } from "@/lib/util-functions";
import { useState, FormEvent, ChangeEvent } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  chatHelpers: UseTypedChatHelpers;
  selectedImage: File | null;
  setSelectedImage: (image: File | null) => void;
  isFetchingFDA: boolean;
}

// Loading message component
const LoadingMessage = () => (
  <div className="p-3 rounded-lg max-w-[80%] bg-violet-50 dark:bg-violet-900/20 text-gray-800 dark:text-gray-200 self-start animate-pulse">
    <div className="flex items-center gap-2">
      <svg 
        className="animate-spin h-5 w-5 text-violet-600 dark:text-violet-400" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span>Thinking...</span>
    </div>
  </div>
);

// FDA loading message component
const FDALoadingMessage = () => (
  <div className="p-3 rounded-lg max-w-[80%] bg-green-50 dark:bg-green-900/20 text-gray-800 dark:text-gray-200 self-start flex items-center gap-2">
    <svg 
      className="animate-spin h-5 w-5 text-green-600 dark:text-green-400" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <span>Asking the FDA...</span>
  </div>
);

export default function ChatInterface({
  chatHelpers,
  selectedImage,
  setSelectedImage,
  isFetchingFDA
}: ChatInterfaceProps) {
  const { messages, input, handleInputChange, handleSubmit: handleChatSubmit, isLoading } = chatHelpers;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedImage) {
      // TODO: Handle image upload
      setSelectedImage(null);
    }
    handleChatSubmit(e);
  };

  // Check if we should show the loading message
  const shouldShowLoadingMessage = isLoading && messages.length > 0 && 
    messages[messages.length - 1].role === "user";

  // Check message content for drug-related terms
  const lastUserMessage = messages.length > 0 && messages[messages.length - 1].role === "user" 
    ? messages[messages.length - 1].content.toLowerCase() 
    : "";
  
  const isDrugQuery = lastUserMessage.includes("drug") || 
    lastUserMessage.includes("medication") || 
    lastUserMessage.includes("medicine") || 
    lastUserMessage.includes("pill") ||
    lastUserMessage.includes("fda");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col w-full h-[calc(100vh-180px)] max-h-[800px]">
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
            {formatMessage(message.content)}
          </div>
        ))}
        
        {/* Show loading state */}
        {shouldShowLoadingMessage && (
          isDrugQuery || isFetchingFDA ? <FDALoadingMessage /> : <LoadingMessage />
        )}
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
  );
} 