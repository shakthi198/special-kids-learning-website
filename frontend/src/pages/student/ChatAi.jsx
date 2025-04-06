import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { generateContent } from "../../assets/GeminiApi.js";
import ReactMarkdown from "react-markdown";

export default function ChatApp() {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);
    try {
      const res = await generateContent(userInput);
      setResponse([
        ...response,
        { type: "user", message: userInput },
        { type: "bot", message: res },
      ]);
      setUserInput("");
    } catch (err) {
      console.error("Error generating response:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen text-white p-6">
      <div className="max-w-3xl mx-auto w-full flex flex-col h-full ">
        {/* <button
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg mb-4"
          onClick={() => (window.location.href = "/student")} // Adjust the URL as needed
        >
          Home
        </button>*/}
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
            placeholder="Type your question..."
            value={userInput}
            onChange={handleUserInput}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg ml-2"
            onClick={handleSubmit}
          >
            <IoIosSend size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
