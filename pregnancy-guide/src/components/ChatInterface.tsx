import { UseChatHelpers } from "@ai-sdk/react";
import { formatMessage } from "@/lib/util-functions";
import { useState, FormEvent, ChangeEvent, useRef, useEffect } from "react";
import Image from "next/image";
import SafetyIndicator from "./SafetyIndicator";

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
  <div className="p-4 rounded-lg bg-[#F3F4FF] text-gray-600 self-start max-w-[85%] flex items-center gap-3">
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#818CF8] border-t-transparent"></div>
    <span>Analyzing...</span>
  </div>
);

// Add this function at the top level, before the ChatInterface component
const removeAlternativesSection = (content: string): string => {
  // Remove the SAFER ALTERNATIVES section and any content after it
  const parts = content.split('SAFER ALTERNATIVES:');
  // Return the first part (everything before SAFER ALTERNATIVES)
  // Trim to remove any trailing whitespace or newlines
  return parts[0].trim();
};

export default function ChatInterface({
  chatHelpers,
}: ChatInterfaceProps) {
  const { messages, setMessages, input, handleInputChange, handleSubmit: handleChatSubmit, isLoading, setInput } = chatHelpers;
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [safetyLevel, setSafetyLevel] = useState<'safe' | 'moderate' | 'notToSafe' | 'notSafe' | null>(null);
  const [alternatives, setAlternatives] = useState<string[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const DEFAULT_IMAGE_MESSAGE = "What is this medication and is it safe during pregnancy?";

  const [shouldSubmit, setShouldSubmit] = useState(false);

  // Function to extract alternatives from AI response
  const extractAlternatives = (content: string): string[] | null => {
    const alternativesMatch = content.match(/SAFER ALTERNATIVES:\n((?:- [^\n]+\n?)+)/);
    if (alternativesMatch && alternativesMatch[1]) {
      return alternativesMatch[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.trim().substring(2));
    }
    return null;
  };

  // Function to determine safety level from AI response
  const determineSafetyLevel = (content: string) => {
    const safetyMatch = content.match(/^\[(SAFE|MODERATE|NOT_TOO_SAFE|NOT_SAFE)\]/i);
    
    if (safetyMatch) {
      const level = safetyMatch[1].toUpperCase();
      switch (level) {
        case 'SAFE':
          return 'safe';
        case 'MODERATE':
          return 'moderate';
        case 'NOT_TOO_SAFE':
          return 'notToSafe';
        case 'NOT_SAFE':
          return 'notSafe';
        default:
          return null;
      }
    }
    
    return null;
  };

  // Update safety level and alternatives when new assistant message is received
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        const level = determineSafetyLevel(lastMessage.content);
        setSafetyLevel(level);
        
        // Only look for alternatives if not safe
        if (level && level !== 'safe') {
          const foundAlternatives = extractAlternatives(lastMessage.content);
          setAlternatives(foundAlternatives);
        } else {
          setAlternatives(null);
        }
      }
    }
  }, [messages]);

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
    const dt = new DataTransfer();
    Array.from(files).forEach((file, index) => {
      if (index !== indexToRemove) {
        dt.items.add(file);
      }
    });
    setFiles(dt.files.length > 0 ? dt.files : undefined);
    if (fileInputRef.current) {
      fileInputRef.current.files = dt.files.length > 0 ? dt.files : null;
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (files && files.length > 0 && !input.trim()) {
      setInput(DEFAULT_IMAGE_MESSAGE);
      setShouldSubmit(true);
      return;
    }
    
    handleChatSubmit(event, {
      experimental_attachments: files,
    });

    setFiles(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const shouldShowLoadingMessage = isLoading && messages.length > 0 && 
    (messages[messages.length - 1].role === "user" || messages[messages.length - 1].content === "");

  return (
    <div className="bg-white h-screen w-full flex flex-col overflow-hidden">
      <header className="w-full px-6 py-2 flex justify-between items-center border-b shrink-0">
        <span className="text-[#818CF8] text-lg">MamaShield</span>
        <span className="text-gray-500 text-sm">Powered by AI & OpenFDA</span>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-4 flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 8C26 8 32 12 32 20C32 28 26 40 24 40C22 40 16 28 16 20C16 12 22 8 24 8Z" fill="#818CF8"/>
            <path d="M24 40V44M20 44H28" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h2 className="text-2xl font-semibold text-[#818CF8]">
            MAMA SHIELD
          </h2>
        </div>

        <p className="text-gray-600 mb-4 shrink-0">
          Welcome to MAMA SHIELD — your AI-powered guide for safer pregnancy, built for mothers & future mothers!
        </p>

        {safetyLevel && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
          <div className="space-y-4 shrink-0">
            <SafetyIndicator safetyLevel={safetyLevel} />
            {alternatives && alternatives.length > 0 && (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <h3 className="font-medium text-green-800 mb-2">Safer Alternatives:</h3>
                <ul className="space-y-2">
                  {alternatives.map((alt, index) => (
                    <li key={index} className="text-green-700 flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {alt}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto min-h-0 mb-4 space-y-4 flex flex-col">
          {messages.length === 0 && (
            <div className="p-4 rounded-lg bg-[#F3F4FF] text-gray-600 self-start max-w-[85%]">
              Hello! I can help you understand how medications might affect pregnancy and breastfeeding. Feel free to ask any questions!
            </div>
          )}
          {messages.map((message: any, index: number) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg max-w-[85%] ${
                message.role === "assistant"
                  ? "bg-[#F3F4FF] text-gray-600 self-start"
                  : "bg-[#818CF8] text-white self-end"
              } ${(index === messages.length - 1 && shouldShowLoadingMessage && message.role === "assistant") ? "hidden" : ""}`}
            >
              {message.role === "assistant" 
                ? formatMessage(removeAlternativesSection(message.content))
                : formatMessage(message.content)
              }
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
                      className="rounded-lg mt-2"
                    />
                  ))}
              </div>
            </div>
          ))}
          
          {shouldShowLoadingMessage && <LoadingMessage />}
        </div>

        {files && files.length > 0 && (
          <div className="mb-4 px-4 py-3 bg-[#F3F4FF] rounded-lg shrink-0">
            <div className="text-sm mb-2 text-gray-600">
              {files.length} image{files.length > 1 ? 's' : ''} selected
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from(files).map((file, index) => (
                <div key={index} className="relative">
                  <div className="w-16 h-16 border border-[#818CF8] rounded-lg overflow-hidden">
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
              <div className="mt-2 text-xs text-gray-500">
                Will send with default message: "{DEFAULT_IMAGE_MESSAGE}"
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-3 shrink-0">
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            multiple
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-3 text-sm bg-[#F3F4FF] text-[#818CF8] rounded-lg hover:bg-[#818CF8] hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </button>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Paste a drug name, TikTok post, or screenshot quote"
            className="flex-1 p-4 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#818CF8]"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#818CF8] text-white rounded-lg hover:bg-[#6366F1] transition-colors font-medium"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
