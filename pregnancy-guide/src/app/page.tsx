"use client";

import { useState, useRef } from "react";
import { useChat } from "@ai-sdk/react";

import Image from "next/image";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  // AI chat integration with simpler approach
  const chatHelpers = useChat({
    maxSteps: 5,
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

  const startRecording = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        chatHelpers.setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-violet-50 dark:from-gray-900 dark:to-gray-800">
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

      <main className="flex-grow container mx-auto p-4 max-w-4xl flex items-center justify-center py-8">
        <ChatInterface
          chatHelpers={chatHelpers}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          isFetchingFDA={false}
          isRecording={isRecording}
          startRecording={startRecording}
        />
      </main>

      <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 py-6 text-center text-sm text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <p>
            This tool provides general information and is not a substitute for
            professional medical advice. Always consult with your healthcare
            provider for medical decisions during pregnancy.
          </p>
        </div>
      </footer>
    </div>
  );
}
