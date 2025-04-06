import { UseChatHelpers } from "@ai-sdk/react";
import { formatMessage } from "@/lib/util-functions";
import { useState, FormEvent, ChangeEvent, useRef, useEffect } from "react";
import Image from "next/image";
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  chatHelpers: UseChatHelpers;
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



export default function ChatInterface({
  chatHelpers,
  
}: ChatInterfaceProps) {
  const { messages, setMessages,input, handleInputChange, handleSubmit: handleChatSubmit, isLoading, setInput } = chatHelpers;

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const DEFAULT_IMAGE_MESSAGE = "Are there any issues with drugs or foods in this image and pregnancies?";

  const [shouldSubmit, setShouldSubmit] = useState(false);

  useEffect(() => {
    if (shouldSubmit) {
      handleChatSubmit(undefined, {experimental_attachments: files});
      setShouldSubmit(false);
      setFiles(undefined);
    }
  }, [shouldSubmit]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    if (!files) return;
    
    // Create a new DataTransfer object to manipulate the FileList
    const dt = new DataTransfer();
    
    // Add all files except the one to remove
    Array.from(files).forEach((file, index) => {
      if (index !== indexToRemove) {
        dt.items.add(file);
      }
    });
    
    // Update the files state
    setFiles(dt.files.length > 0 ? dt.files : undefined);
    
    // Update the file input value
    if (fileInputRef.current) {
      fileInputRef.current.files = dt.files.length > 0 ? dt.files : null;
    }
  };

  const handleSubmit = async (event: FormEvent) => {
   
    // If there's an image but no text input, set a default message
    if (files && files.length > 0 && !input.trim()) {
        // Prevent default form submission
        event.preventDefault();
        
       setInput(DEFAULT_IMAGE_MESSAGE);
       setShouldSubmit(true);
      
      return;
    }
    
    // Normal submission with text input
    handleChatSubmit(event, {
      experimental_attachments: files,
    });

    setFiles(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Check if we should show the loading message
  const shouldShowLoadingMessage = isLoading && messages.length > 0 && 
    (messages[messages.length - 1].role === "user" || messages[messages.length - 1].content === "");

  // Check message content for drug-related terms
  

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col w-full h-[calc(100vh-180px)] max-h-[800px]">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        AI Pregnancy Assistant
      </h2>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 flex flex-col">
      {messages.map((message: any, index: number) => (
  <div
    key={message.id}
    className={`p-3 rounded-lg max-w-[80%] ${
      message.role === "assistant"
        ? "bg-violet-50 dark:bg-violet-900/20 text-gray-800 dark:text-gray-200 self-start"
        : "bg-blue-50 dark:bg-blue-900/20 text-gray-800 dark:text-gray-200 self-end"
    } ${(index === messages.length - 1 && shouldShowLoadingMessage && message.role === "assistant") ? "hidden" : ""}`}
  >
    {formatMessage(message.content)}
    <div>
      {message?.experimental_attachments
        ?.filter((attachment: any) =>
          attachment?.contentType?.startsWith('image/')
        )
        .map((attachment: any, index: number) => (
          <Image
            key={`${message.id}-${index}`}
            src={attachment.url}
            width={500}
            height={500}
            alt={attachment.name ?? `attachment-${index}`}
          />
        ))}
    </div>
  </div>
))}
        
        {/* Show loading state */}
        {shouldShowLoadingMessage && <LoadingMessage />}
      </div>

      {/* Image Preview with Remove Buttons */}
      {files && files.length > 0 && (
        <div className="mb-3 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded">
          <div className="text-sm mb-2 text-gray-700 dark:text-gray-300">
            {files.length} image{files.length > 1 ? 's' : ''} selected
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from(files).map((file, index) => (
              <div key={index} className="relative">
                <div className="w-16 h-16 border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                    onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {!input.trim() && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
              Will send with default message: "{DEFAULT_IMAGE_MESSAGE}"
            </div>
          )}
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
            ref={fileInputRef}
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
          disabled={isLoading || (!input.trim() && !files)}
          className="py-2 px-4 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Send your message to the AI assistant"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
} 