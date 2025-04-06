import { useState } from "react";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import { FaPlay, FaFilePdf } from "react-icons/fa";
import mammoth from "mammoth"; // For .docx support

// Set up PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

const API_KEY = "sk_f4d51d0aa747f16b091db1137c5daaa9e3052b697a8c0829"; // Replace with your API Key
const VOICE_ID = "	pNInz6obpgDQGcFmaJgB"; // Use any Eleven Labs voice ID

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);

  const handleSpeak = async () => {
    if (!text.trim()) {
      alert("Enter text or upload a document");
      return;
    }

    try {
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: { stability: 0.5, similarity_boost: 0.5 },
        },
        {
          headers: {
            "xi-api-key": API_KEY,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );

      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      new Audio(audioUrl).play();
    } catch (error) {
      console.error("Error generating speech:", error);
      alert("Error generating speech. Please check your API key.");
    }
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) {
      alert("No file selected. Please upload a valid file.");
      return;
    }

    const fileType = uploadedFile.type;

    if (fileType === "application/pdf") {
      // Handle PDF files
      setFile(uploadedFile);
      extractTextFromPDF(uploadedFile);
    } else if (fileType === "text/plain") {
      // Handle plain text files
      const reader = new FileReader();
      reader.onload = (e) => setText(e.target.result);
      reader.readAsText(uploadedFile);
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // Handle .docx files
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = await mammoth.extractRawText({
            arrayBuffer: e.target.result,
          });
          setText(result.value);
        } catch (error) {
          console.error("Error extracting text from .docx file:", error);
          alert(
            "Failed to extract text from the Word document. Please try again."
          );
        }
      };
      reader.readAsArrayBuffer(uploadedFile);
    } else {
      alert(
        "Unsupported file format. Please upload a .pdf, .txt, or .docx file."
      );
    }
  };

  const extractTextFromPDF = async (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async (e) => {
      try {
        const pdf = await pdfjs.getDocument({ data: e.target.result }).promise;
        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          extractedText +=
            textContent.items.map((item) => item.str).join(" ") + "\n";
        }

        setText(extractedText);
      } catch (error) {
        console.error("Error extracting text from PDF:", error);
        alert("Failed to extract text from the PDF. Please try again.");
      }
    };
  };

  return (
    <div className="min-h-screen  text-white flex flex-col items-center p-6">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg shadow-lg rounded-xl p-8 w-full max-w-3xl m-10 bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
        <h2 className="text-3xl font-bold text-center mb-6">
          🗣️ Text-to-Speech Converter
        </h2>

        <textarea
          className="w-full h-32 p-4 rounded-lg shadow-md text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Type text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <label className="mt-6 flex items-center justify-center space-x-3 bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-lg shadow-md cursor-pointer transition-all">
          <FaFilePdf size={20} />
          <span>Upload File</span>
          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={handleFileUpload}
            hidden
          />
        </label>

        {file && (
          <div className="mt-6 bg-gray-900 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">File Preview</h3>
            {file.type === "application/pdf" ? (
              <Document
                file={file}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    scale={1.5}
                  />
                ))}
              </Document>
            ) : (
              <p className="text-sm text-gray-300">{text}</p>
            )}
          </div>
        )}

        <button
          onClick={handleSpeak}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-md flex items-center justify-center space-x-3 transition-all"
        >
          <FaPlay />
          <span>Speak</span>
        </button>
      </div>
    </div>
  );
};

export default TextToSpeech;
