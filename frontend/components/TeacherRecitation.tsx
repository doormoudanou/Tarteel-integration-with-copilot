"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader, Play, Pause, AlertCircle } from "lucide-react";
import { useRecitationWebSocket } from "@/lib/useRecitationWebSocket";

interface TeacherRecitationProps {
  surahNumber: number;
  ayahNumber: number;
  ayahText: string;
  onResult: (result: any) => void;
  result?: any;
}

export default function TeacherRecitation({
  surahNumber,
  ayahNumber,
  ayahText,
  onResult,
  result,
}: TeacherRecitationProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [isPlayingTeacher, setIsPlayingTeacher] = useState(false);
  const [hasListened, setHasListened] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { analysis, isConnected, sendAudioData, resetAnalysis } =
    useRecitationWebSocket();

  // Teacher recitation audio URL - from cdn.islamic.network
  const teacherAudioUrl = `https://cdn.islamic.network/quran/ar.alafasy/${surahNumber}${String(
    ayahNumber,
  ).padStart(3, "0")}.mp3`;

  const startRecording = async () => {
    setError("");
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError(
          "Your browser doesn't support microphone access. Please use Chrome, Firefox, or Safari.",
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
          "Microphone permission denied. Please allow microphone access in your browser settings.",
        );
      } else if (
        error.name === "NotFoundError" ||
        error.name === "DevicesNotFoundError"
      ) {
        setError(
          "No microphone found. Please connect a microphone and try again.",
        );
      } else if (
        error.name === "NotReadableError" ||
        error.name === "SecurityError"
      ) {
        setError(
          "Unable to access microphone. It may be in use by another application.",
        );
      } else {
        setError(
          "Could not access microphone. Please check your device settings.",
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
  useEffect(() => {
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
  }, [analysis, surahNumber, ayahNumber, result, onResult]);

  const handlePlayTeacher = () => {
    if (audioRef.current) {
      if (isPlayingTeacher) {
        audioRef.current.pause();
        setIsPlayingTeacher(false);
      } else {
        setAudioLoading(true);
        audioRef.current.play().catch((err) => {
          console.error("Error playing audio:", err);
          setError("Could not play audio. Check your internet connection.");
        });
        setHasListened(true);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Teacher Recitation Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6">
        <div className="text-center">
          <p className="text-sm font-semibold text-blue-700 mb-4 uppercase tracking-wide">
            👨‍🏫 Listen to the Ustaz (Teacher)
          </p>

          <audio
            ref={audioRef}
            src={teacherAudioUrl}
            onEnded={() => setIsPlayingTeacher(false)}
            onPlay={() => {
              setIsPlayingTeacher(true);
              setAudioLoading(false);
            }}
            onLoadStart={() => setAudioLoading(true)}
            onCanPlay={() => setAudioLoading(false)}
            crossOrigin="anonymous"
          />

          <button
            onClick={handlePlayTeacher}
            disabled={audioLoading}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-all ${
              isPlayingTeacher
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg disabled:opacity-50"
            }`}
          >
            {audioLoading ? (
              <>
                <Loader className="h-6 w-6 animate-spin" />
                Loading...
              </>
            ) : isPlayingTeacher ? (
              <>
                <Pause className="h-6 w-6" />
                Pause Recitation
              </>
            ) : (
              <>
                <Play className="h-6 w-6" />
                Play Teacher Recitation
              </>
            )}
          </button>

          {hasListened && !isPlayingTeacher && (
            <p className="text-sm text-blue-700 mt-3">
              ✓ You listened to the correct recitation
            </p>
          )}
        </div>
      </div>

      {/* Student Recording Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-300 rounded-xl p-6">
        <div className="text-center">
          <p className="text-sm font-semibold text-emerald-700 mb-6 uppercase tracking-wide">
            🎤 Now You Recite (Student)
          </p>

          {error && (
            <div className="flex gap-3 p-4 rounded-lg bg-red-50 border border-red-200 mb-6">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 text-left">{error}</p>
            </div>
          )}

          <div className="flex justify-center items-center gap-4 mb-6">
            {/* Main Microphone Button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!isConnected || result?.verified || !!error}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 font-medium shadow-xl ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
              title={
                result?.verified
                  ? "Ayah completed!"
                  : isRecording
                    ? "Click to stop recording"
                    : "Click to start recording"
              }
            >
              {isRecording ? (
                <MicOff className="h-10 w-10" />
              ) : (
                <Mic className="h-10 w-10" />
              )}
            </button>

            {/* Status Indicator */}
            <div className="text-left">
              {isRecording && (
                <div className="flex items-center gap-2">
                  <Loader className="h-5 w-5 animate-spin text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">
                    Recording...
                  </span>
                </div>
              )}

              {!isConnected && !isRecording && !error && (
                <span className="text-sm text-amber-600 font-medium">
                  ⏳ Connecting to server...
                </span>
              )}

              {isConnected && !isRecording && !error && (
                <span className="text-sm text-emerald-600 font-medium">
                  ✓ Ready to record
                </span>
              )}

              {result && !isRecording && (
                <div>
                  {result.verified ? (
                    <span className="text-sm font-semibold text-emerald-700">
                      ✅ Perfect recitation!
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-red-700">
                      Try again to improve
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          {!result && (
            <div className="text-sm text-emerald-700 bg-white/60 rounded-lg p-3 inline-block">
              <p>1. Listen to the Ustaz recitation above</p>
              <p>2. Click the microphone to start recording</p>
              <p>3. Recite the ayah as you heard it</p>
              <p>4. We'll check your pronunciation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
