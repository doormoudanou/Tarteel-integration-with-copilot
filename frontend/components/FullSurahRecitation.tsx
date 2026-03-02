"use client";

import { useEffect, useState, useRef } from "react";
import { X, Mic, MicOff } from "lucide-react";

interface FullSurahRecitationProps {
  surahNumber: number;
  onBack: () => void;
}

interface Ayah {
  number: number;
  text: string;
}

export default function FullSurahRecitation({
  surahNumber,
  onBack,
}: FullSurahRecitationProps) {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [surahName, setSurahName] = useState("");
  const [displayAyahs, setDisplayAyahs] = useState<Ayah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [highlightedAyahs, setHighlightedAyahs] = useState<Record<number, any>>(
    {},
  );

  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition - same as SpeechToText
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition not supported. Use Chrome, Firefox, or Edge.",
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "ar-SA";

      recognition.onstart = () => {
        console.log("🎤 Listening...");
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart + " ";
          } else {
            interimTranscript += transcriptPart;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event: any) => {
        if (event.error !== "aborted" && event.error !== "no-speech") {
          console.error("Speech error:", event.error);
        }
      };

      recognition.onend = () => {
        console.log("🛑 Listening stopped");
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (error) {
      console.error("Error initializing speech recognition:", error);
      setError("Could not initialize speech recognition.");
    }
  }, []);

  // Fetch surah data
  useEffect(() => {
    const fetchSurah = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://localhost:8000/api/quran/surah/${surahNumber}`,
        );
        if (!res.ok) throw new Error("Failed to fetch surah");

        const data = await res.json();
        setSurahName(data.surah?.englishName || "");

        const ayahsData = (data.ayahs || []).map((ayah: any) => ({
          number: ayah.number,
          text: ayah.text,
        }));
        setAyahs(ayahsData);
        setDisplayAyahs(ayahsData.slice(0, 10));
      } catch (err) {
        console.error("Failed to load surah:", err);
        setError("Failed to load surah.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurah();
  }, [surahNumber]);

  // Analyze transcript when user clicks "See Review"
  const handleAnalyzeRecitation = async () => {
    if (!transcript.trim()) {
      setError("Please recite first before reviewing.");
      return;
    }

    console.log("📊 Analyzing:", transcript);
    try {
      const expectedText = displayAyahs
        .map((ayah) => ayah.text)
        .join(" ")
        .replace(/\s+/g, " ");

      const response = await fetch(
        "http://localhost:8000/api/quran/analyze-recitation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcript: transcript,
            expected_text: expectedText,
            surah_number: surahNumber,
            ayahs: displayAyahs,
          }),
        },
      );

      const data = await response.json();
      console.log("✅ Analysis:", data);

      setAnalysisResults(data);

      if (data.errors && data.errors.length > 0) {
        const errorsByAyah: Record<number, any> = {};
        data.errors.forEach((error: any) => {
          const ayahNum = error.ayah_number || displayAyahs[0]?.number;
          if (!errorsByAyah[ayahNum]) {
            errorsByAyah[ayahNum] = [];
          }
          errorsByAyah[ayahNum].push(error);
        });
        setHighlightedAyahs(errorsByAyah);
      } else {
        setHighlightedAyahs({});
      }

      setShowReview(true);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze. Try again.");
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        setTranscript("");
        recognitionRef.current.start();
      } catch (err) {
        console.error("Error starting:", err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Error stopping:", err);
      }
    }
  };

  const getHighlightedText = (ayahText: string, ayahNumber: number) => {
    if (
      !highlightedAyahs ||
      !highlightedAyahs[ayahNumber] ||
      highlightedAyahs[ayahNumber].length === 0
    ) {
      return ayahText;
    }

    let result = ayahText;
    highlightedAyahs[ayahNumber].forEach((error: any) => {
      if (error.word) {
        const escaped = error.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escaped, "g");
        result = result.replace(
          regex,
          `<span style="background-color: #ff4444; color: white; padding: 2px 4px; border-radius: 3px;">$&</span>`,
        );
      }
    });

    return result;
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
        >
          ← Back
        </button>
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition font-medium"
            >
              ← Back
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">{surahName}</h1>
              <p className="text-sm text-gray-600">Surah {surahNumber}</p>
            </div>
            <div className="w-32"></div>
          </div>

          {isListening && (
            <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold">
              <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
              Listening...
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 pb-32">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        )}

        {/* Surah Text */}
        <div className="bg-gradient-to-b from-yellow-50 to-white rounded-2xl shadow-2xl p-12 border-4 border-yellow-200 mb-8">
          {surahNumber !== 9 && (
            <div className="text-center mb-8 pb-6 border-b-2 border-yellow-300">
              <p className="quran-book-large text-emerald-800">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
          )}

          <div className="text-center leading-loose">
            <p className="quran-book text-gray-900 inline">
              {displayAyahs.map((ayah, index) => (
                <span key={ayah.number}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: getHighlightedText(ayah.text, ayah.number),
                    }}
                  />
                  <span className="mx-2">
                    <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center leading-none">
                      {ayah.number}
                    </span>
                  </span>
                  {index < displayAyahs.length - 1 && " "}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 font-medium shadow-2xl ${
              isListening
                ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {isListening ? (
              <MicOff className="h-16 w-16" />
            ) : (
              <Mic className="h-16 w-16" />
            )}
          </button>

          <div className="text-center">
            {isListening ? (
              <p className="text-lg font-semibold text-emerald-700">
                🎤 Listening... Recite the Surah
              </p>
            ) : transcript ? (
              <p className="text-lg font-semibold text-emerald-700">
                ✅ Recording complete
              </p>
            ) : (
              <p className="text-lg font-semibold text-gray-700">
                Click mic to recite
              </p>
            )}
          </div>

          {transcript && (
            <div className="mt-6 p-6 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 max-w-2xl w-full">
              <h3 className="font-bold text-lg text-blue-900 mb-3">
                📝 Your Recitation:
              </h3>
              <p className="text-gray-900 leading-relaxed mb-4">{transcript}</p>
              <button
                onClick={handleAnalyzeRecitation}
                className="w-full px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold transition"
              >
                📋 See Review & Analysis
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Review Drawer */}
      {showReview && analysisResults && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowReview(false)}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Review</h2>
              <button
                onClick={() => setShowReview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-300 rounded-lg p-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-emerald-700 mb-2">
                    {(analysisResults.accuracy * 100).toFixed(0)}%
                  </p>
                  <p className="text-lg font-semibold text-emerald-900">
                    Accuracy
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  You Said:
                </h3>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <p className="text-gray-900">{transcript}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Expected:
                </h3>
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <p className="quran-book text-gray-900">
                    {displayAyahs.map((a) => a.text).join(" ")}
                  </p>
                </div>
              </div>

              {analysisResults.errors && analysisResults.errors.length > 0 ? (
                <div>
                  <h3 className="text-lg font-bold text-red-800 mb-4">
                    Issues ({analysisResults.errors.length}):
                  </h3>
                  <div className="space-y-3">
                    {analysisResults.errors.map((error: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-red-50 border-l-4 border-red-400 p-4 rounded"
                      >
                        <p className="font-semibold text-red-900 capitalize">
                          {error.type}
                        </p>
                        <p className="text-sm text-red-800 mt-2">
                          <span className="font-medium">Expected:</span>{" "}
                          {error.expected}
                        </p>
                        <p className="text-sm text-red-800">
                          <span className="font-medium">You said:</span>{" "}
                          {error.actual}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-6 text-center">
                  <p className="text-3xl mb-2">✅</p>
                  <p className="text-lg font-semibold text-emerald-900">
                    Perfect!
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowReview(false);
                    setAnalysisResults(null);
                    setTranscript("");
                    setHighlightedAyahs({});
                  }}
                  className="flex-1 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold transition"
                >
                  Try Again
                </button>
                <button
                  onClick={onBack}
                  className="flex-1 py-3 rounded-lg bg-gray-300 text-gray-900 hover:bg-gray-400 font-semibold transition"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
