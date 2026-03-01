'use client'

import { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX, Loader } from 'lucide-react'

interface AudioPlayerProps {
  text: string
  language?: string
  rate?: number
  pitch?: number
}

export default function AudioPlayer({
  text,
  language = 'ar-SA',
  rate = 1,
  pitch = 1
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    // Get speech synthesis instance
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  const handlePlay = () => {
    if (!text || !synthRef.current) return

    // Cancel any ongoing speech
    if (synthRef.current.speaking) {
      synthRef.current.cancel()
      setIsPlaying(false)
      return
    }

    setIsLoading(true)

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = 1

    utterance.onstart = () => {
      setIsLoading(false)
      setIsPlaying(true)
    }

    utterance.onend = () => {
      setIsPlaying(false)
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error)
      setIsPlaying(false)
      setIsLoading(false)
    }

    utteranceRef.current = utterance

    // Speak
    synthRef.current.speak(utterance)
  }

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsPlaying(false)
    }
  }

  return (
    <button
      onClick={isPlaying ? handleStop : handlePlay}
      disabled={isLoading || !text}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
        isPlaying
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
      }`}
      title={isPlaying ? 'Stop audio' : 'Play audio'}
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
          Play Audio
        </>
      )}
    </button>
  )
}
