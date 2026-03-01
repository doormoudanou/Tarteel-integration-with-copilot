"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Copy, Check } from "lucide-react";

interface SpeechToTextProps {
  onTranscriptionComplete?: (text: string) => void;
  language?: string;
}

export default function SpeechToText({
  onTranscriptionComplete,
  language = "ar-SA",
}: SpeechToTextProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [transcriptWithTashkeel, setTranscriptWithTashkeel] = useState("");
  const [detectedAyahs, setDetectedAyahs] = useState<any[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const processingTimeoutRef = useRef<any>(null);

  useEffect(() => {
    // Check browser support
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;

            if (event.results[i].isFinal) {
              finalTranscript += transcript + " ";
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript(finalTranscript + interimTranscript);
        };

        recognition.onerror = (event: any) => {
          if (event.error !== "aborted" && event.error !== "no-speech") {
            console.error("Speech recognition error:", event.error);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          if (transcript && onTranscriptionComplete) {
            onTranscriptionComplete(transcript);
          }
        };

        recognitionRef.current = recognition;
        setIsSupported(true);
      } catch (error) {
        console.error("Error initializing speech recognition:", error);
        setIsSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, [language]);

  // Debounced tashkeel addition - only after user stops speaking
  useEffect(() => {
    if (transcript && !isListening) {
      // Clear previous timeout
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }

      // Add tashkeel after user stops speaking (500ms delay)
      processingTimeoutRef.current = setTimeout(() => {
        addTashkeelToText(transcript);
      }, 500);
    }

    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, [transcript, isListening]);

  // Function to add tashkeel via backend
  const addTashkeelToText = async (text: string) => {
    if (!text.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/speech/add-tashkeel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text,
            context: "quran",
          }),
        },
      );

      const data = await response.json();

      console.log("Tashkeel response:", data);

      if (data.with_tashkeel) {
        setTranscriptWithTashkeel(data.with_tashkeel);
        if (data.detected_ayahs && data.detected_ayahs.length > 0) {
          setDetectedAyahs(data.detected_ayahs);
        }

        // Log sequence info if available
        if (data.sequence_info) {
          console.log(
            `✅ Detected ${data.sequence_info.total_ayahs} ayahs from Surah ${data.sequence_info.surah} (Ayahs ${data.sequence_info.start_ayah}-${data.sequence_info.end_ayah})`,
          );
        }
      }
    } catch (error) {
      console.error("Error adding tashkeel:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting recognition:", error);
      }
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
    }
  };

  const handleCopy = () => {
    const textToCopy = transcriptWithTashkeel || transcript;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClear = () => {
    setTranscript("");
    setTranscriptWithTashkeel("");
    setDetectedAyahs([]);
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <p className="text-sm text-yellow-800">
          ⚠️ Speech-to-Text is not supported in your browser. Please use Chrome,
          Firefox, or Edge.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Recording Button */}
      <div className="flex gap-3">
        <button
          onClick={isListening ? handleStopListening : handleStartListening}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
            isListening
              ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="h-5 w-5" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="h-5 w-5" />
              Start Speaking
            </>
          )}
        </button>

        {transcript && (
          <>
            <button
              onClick={handleCopy}
              className="px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
              title="Copy to clipboard"
            >
              {isCopied ? (
                <Check className="h-5 w-5" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-3 rounded-lg bg-gray-400 hover:bg-gray-500 text-white transition"
              title="Clear text"
            >
              ✕
            </button>
          </>
        )}
      </div>

      {/* Status */}
      {isListening && (
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p className="text-sm text-blue-800">
            🎤 Listening... Speak clearly in Arabic
          </p>
        </div>
      )}

      {/* Transcript Display */}
      {transcript && (
        <div className="space-y-4">
          {/* Original transcript */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
            <p className="text-xs text-gray-500 mb-2">
              Recognized Speech (sans tashkeel):
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {transcript}
            </p>
          </div>

          {/* Processing indicator */}
          {isProcessing && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 text-center">
              <p className="text-sm text-blue-800">
                ⏳ Adding tashkeel and detecting ayahs...
              </p>
            </div>
          )}

          {/* Transcript with tashkeel */}
          {transcriptWithTashkeel && (
            <div className="bg-white rounded-lg p-4 border-2 border-emerald-300">
              <p className="text-xs text-emerald-600 font-semibold mb-2">
                ✨ Avec Tashkeel:
              </p>
              <p
                className="text-2xl text-gray-900 leading-relaxed arabic-text"
                dir="rtl"
              >
                {transcriptWithTashkeel}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {transcriptWithTashkeel.length} caractères
              </p>
            </div>
          )}

          {/* Detected Ayahs */}
          {detectedAyahs.length > 0 && (
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-300">
              <p className="text-sm font-semibold text-emerald-800 mb-3">
                🕌 Ayahs détectées:
              </p>
              <div className="space-y-2">
                {detectedAyahs.map((ayah, index) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded border border-emerald-200"
                  >
                    <p className="text-xs text-gray-600 mb-1">
                      Surah {ayah.surah}, Ayah {ayah.ayah} (
                      {Math.round(ayah.similarity * 100)}% match)
                    </p>
                    <p className="text-sm text-gray-900 arabic-text" dir="rtl">
                      {ayah.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!transcript && !isListening && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            👆 Click "Start Speaking" to begin recording
          </p>
        </div>
      )}
    </div>
  );
}
