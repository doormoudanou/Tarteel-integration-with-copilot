"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Loader } from "lucide-react";

interface QuranAudioPlayerProps {
  surahNumber: number;
  ayahNumber: number;
  reciter?: string; // e.g., 'ar.alafasy', 'ar.mishari', 'ar.abdulsamad'
}

export default function QuranAudioPlayer({
  surahNumber,
  ayahNumber,
  reciter = "ar.alafasy",
}: QuranAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [error, setError] = useState<string>("");

  // Use backend proxy instead of direct CDN URL to avoid CORS issues
  const audioUrl = `http://localhost:8000/api/quran/audio/${surahNumber}/${ayahNumber}?reciter=${reciter}`;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      setError("Failed to load audio");
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  const handlePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await audioRef.current.play();
    } catch (err) {
      console.error("Audio play error:", err);
      setError("Failed to play audio");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <audio ref={audioRef} src={audioUrl} crossOrigin="anonymous" />

      <button
        onClick={handlePlay}
        disabled={isLoading}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
          isPlaying
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        }`}
        title={isPlaying ? "Stop audio" : "Play recitation"}
      >
        {isLoading ? (
          <>
            <Loader className="h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : isPlaying ? (
          <>
            <VolumeX className="h-4 w-4" />
            Stop
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4" />
            🎙️ Listen
          </>
        )}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Reciter selector info */}
      <p className="text-xs text-gray-600">Recitation: Al-Afasy</p>
    </div>
  );
}
