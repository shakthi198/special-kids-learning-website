import React, { useState } from "react";
import { IoIosSend, IoMdMic } from "react-icons/io";
import { generateContent } from "../../assets/GeminiApi.js";
import ReactMarkdown from "react-markdown";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function ChatApp() {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // Ensure we use the correct speech synthesis instance
  const synth = window.speechSynthesis;

  // Function to stop any ongoing speech and start reading aloud
  const speakResponse = (text) => {
    if (!text) return;
    synth.cancel(); // Ensure previous speech is stopped
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    synth.speak(utterance);
  };

  // Toggle Pause & Resume Speech
  const togglePauseResume = () => {
    if (synth.speaking) {
      if (synth.paused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.pause();
        setIsPaused(true);
      }
    }
  };

  // Start & Stop Reading
  const toggleSpeech = () => {
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    } else {
      const fullText = response
        .filter((msg) => msg.type === "bot")
        .map((msg) => msg.message)
        .join(" ");
      speakResponse(fullText);
    }
  };

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async () => {
    const inputText = userInput.trim() || transcript.trim(); // Use speech if text input is empty
    if (!inputText) return;

    setIsLoading(true);
    try {
      const res = await generateContent(inputText);
      setResponse([
        ...response,
        { type: "user", message: inputText },
        { type: "bot", message: res },
      ]);
      setUserInput(""); // Clear text input
      resetTranscript(); // Clear speech transcript
      speakResponse(res); // Automatically start reading aloud the response
    } catch (err) {
      console.error("Error generating response:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Start voice input
  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: "en-US" });
  };

  return (
    <div className="flex flex-col h-screen text-white p-6">
      <div className="max-w-3xl mx-auto w-full flex flex-col h-full">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mb-4">
          Smart AI Tutor
        </h1>
        <div className="flex-1 overflow-y-auto bg-gray-800 rounded-lg p-4 space-y-4">
          {response.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                msg.type === "user" ? "bg-blue-500 ml-auto" : "bg-gray-700"
              }`}
            >
              <ReactMarkdown>{msg.message}</ReactMarkdown>
            </div>
          ))}
          {isLoading && <p className="text-gray-400">Generating response...</p>}
        </div>
        <div className="mt-4 flex items-center bg-gray-800 p-3 rounded-lg shadow-md">
          <textarea
            className="flex-1 bg-transparent outline-none resize-none text-white p-2"
            placeholder="Type your question or press mic..."
            value={userInput || transcript} // Auto-fill with speech text
            onChange={handleUserInput}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg ml-2"
            onClick={handleSubmit}
          >
            <IoIosSend size={24} />
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg ml-2"
            onClick={startListening}
          >
            <IoMdMic size={24} />
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg ml-2"
            onClick={togglePauseResume}
          >
            {isPaused ? "▶️ Resume" : "⏸️ Pause"}
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg ml-2"
            onClick={toggleSpeech}
          >
            {isSpeaking ? "🛑 Stop" : "📖 Start"}
          </button>
        </div>
      </div>
    </div>
  );
}
