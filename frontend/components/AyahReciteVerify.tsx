"use client";

import { useState, useRef } from "react";
import { Mic, MicOff, Loader, AlertCircle } from "lucide-react";
import { useRecitationWebSocket } from "@/lib/useRecitationWebSocket";

interface AyahReciteVerifyProps {
  surahNumber: number;
  ayahNumber: number;
  ayahText: string;
  onResult: (result: any) => void;
  result?: any;
}

export default function AyahReciteVerify({
  surahNumber,
  ayahNumber,
  ayahText,
  onResult,
  result,
}: AyahReciteVerifyProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { analysis, isConnected, sendAudioData, resetAnalysis } =
    useRecitationWebSocket();

  const startRecording = async () => {
    setError("");
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices?.getUserMedia) {
        setError(
          "Your browser doesn't support microphone access. Please use a modern browser like Chrome, Firefox, or Safari.",
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      setMediaStream(stream);
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await sendAudioForAnalysis(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
        setMediaStream(null);
      };
      mediaRecorder.start(1000);
      setIsRecording(true);
      resetAnalysis();
    } catch (error: any) {
      console.error("Microphone error:", error);

      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        setError(
          "Microphone permission denied. Please allow microphone access in your browser settings and try again.",
        );
      } else if (
        error.name === "NotFoundError" ||
        error.name === "DevicesNotFoundError"
      ) {
        setError(
          "No microphone found on your device. Please connect a microphone and try again.",
        );
      } else if (
        error.name === "NotReadableError" ||
        error.name === "SecurityError"
      ) {
        setError(
          "Unable to access microphone. It may be in use by another application or blocked by your system.",
        );
      } else {
        setError(
          "Could not access microphone. Please check your device settings and permissions.",
        );
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioForAnalysis = async (audioBlob: Blob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = reader.result?.toString().split(",")[1] || "";
      sendAudioData(base64Audio, surahNumber, ayahNumber);
    };
    reader.readAsDataURL(audioBlob);
  };

  // Listen for analysis results
  if (
    analysis &&
    analysis.surahNumber === surahNumber &&
    analysis.ayahNumber === ayahNumber &&
    !result
  ) {
    onResult({
      verified:
        analysis.confidence > 0.8 &&
        (!analysis.tajweed?.errors || analysis.tajweed.errors.length === 0),
      analysis,
    });
  }

  return (
    <div
      className={`p-6 rounded-xl shadow bg-white flex flex-col gap-2 border-l-4 ${result?.verified ? "border-emerald-500" : result ? "border-red-500" : "border-gray-200"}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-lg">Ayah {ayahNumber}</span>
        <span className="text-gray-500 text-sm">
          {isConnected ? "✓ Connected" : "⏳ Connecting..."}
        </span>
      </div>

      <div className="text-2xl text-emerald-900 leading-loose">{ayahText}</div>

      {error && (
        <div className="flex gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex gap-4 items-center pt-2">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!isConnected || result?.verified || !!error}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all font-medium ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
        >
          {isRecording ? (
            <MicOff className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </button>

        {isRecording && (
          <div className="flex items-center gap-2">
            <Loader className="h-5 w-5 animate-spin text-emerald-600" />
            <span className="text-sm text-emerald-600 font-medium">
              Recording...
            </span>
          </div>
        )}

        {result && (
          <span
            className={`font-semibold text-lg ${
              result.verified ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {result.verified ? "✅ Correct" : "❌ Try Again"}
          </span>
        )}

        {!isConnected && !error && (
          <span className="text-sm text-amber-600 font-medium">
            Waiting for connection...
          </span>
        )}
      </div>

      {result?.analysis?.tajweed?.errors &&
        result.analysis.tajweed.errors.length > 0 && (
          <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
            <div className="font-semibold text-red-800 mb-2 text-sm">
              Tajweed Issues:
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
              {result.analysis.tajweed.errors.map((err: any, idx: number) => (
                <li key={idx}>
                  <span className="font-medium">{err.type}:</span> Expected "
                  {err.expected}" got "{err.received}"
                </li>
              ))}
            </ul>
          </div>
        )}

      {result?.verified && (
        <div className="text-sm text-emerald-700 font-medium pt-2">
          Confidence: {(result.analysis?.confidence * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
}
