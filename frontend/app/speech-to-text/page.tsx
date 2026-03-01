'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import SpeechToText from '@/components/SpeechToText'

export default function SpeechToTextPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-emerald-600" />
              <h1 className="text-xl font-bold text-gray-900">Speech-to-Text Practice</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Info Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              🗣️ Speech-to-Text Practice
            </h2>
            <p className="text-gray-700 text-center leading-relaxed">
              Practice speaking Arabic and convert your speech to text in real-time.
              This tool helps you practice your pronunciation and see how the system recognizes your speech.
            </p>
          </div>

          {/* Speech-to-Text Component */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <SpeechToText
              language="ar-SA"
              onTranscriptionComplete={(text) => {
                console.log("Transcription:", text)
              }}
            />
          </div>

          {/* Tips Section */}
          <div className="bg-blue-50 rounded-2xl shadow p-6 mt-8 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Tips for Best Results:</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex gap-2">
                <span>✓</span>
                <span>Speak clearly and slowly</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Use a quiet environment</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Speak in Arabic (al-Fusha or modern standard Arabic)</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Click "Start Speaking" to begin recording</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Click "Stop Listening" when finished</span>
              </li>
            </ul>
          </div>

          {/* Browser Support */}
          <div className="bg-yellow-50 rounded-2xl shadow p-6 mt-8 border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">🌐 Browser Support:</h3>
            <p className="text-yellow-800">
              Speech-to-Text works best in Chrome, Firefox, and Edge.
              Safari has limited support. Please use an up-to-date browser.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
