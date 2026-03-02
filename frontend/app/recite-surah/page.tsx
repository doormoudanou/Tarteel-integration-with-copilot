"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import FullSurahRecitation from "@/components/FullSurahRecitation";

interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
}

export default function ReciteSurahPage() {
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [surahs, setSurahs] = useState<SurahInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/quran/surahs");
        const data = await response.json();
        if (data.surahs && Array.isArray(data.surahs)) {
          setSurahs(data.surahs);
        }
      } catch (error) {
        console.error("Error fetching surahs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-emerald-600" />
              <h1 className="text-xl font-bold text-gray-900">Recite Surah</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!selectedSurah ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
                Select a Surah to Recite
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Choose a Surah from the list below. You'll recite each ayah and
                receive instant verification feedback.
              </p>

              {loading ? (
                <p className="text-center text-gray-600">Loading surahs...</p>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {surahs.map((surah) => (
                    <button
                      key={surah.number}
                      onClick={() => setSelectedSurah(surah.number)}
                      className="w-full text-left px-6 py-4 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-emerald-600">
                            {surah.number}
                          </span>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {surah.englishName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {surah.englishNameTranslation}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl text-emerald-900 mb-1">
                            {surah.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {surah.numberOfAyahs} Ayahs
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <FullSurahRecitation
            surahNumber={selectedSurah}
            onBack={() => setSelectedSurah(null)}
          />
        )}
      </div>
    </main>
  );
}
