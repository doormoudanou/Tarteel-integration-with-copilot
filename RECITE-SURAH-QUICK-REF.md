# 🎯 Quick Reference - Recite Surah Feature

## File Structure
```
quran-recitation-app/
├── frontend/
│   ├── app/
│   │   ├── page.tsx (updated with "Recite Surah" button)
│   │   └── recite-surah/
│   │       └── page.tsx (NEW)
│   └── components/
│       ├── FullSurahRecitation.tsx (NEW)
│       └── AyahReciteVerify.tsx (NEW)
│
└── Documentation/
    ├── RECITE-SURAH-GUIDE.md (NEW)
    ├── SURAH-RECITATION-IMPLEMENTATION.md (NEW)
    └── RECITE-SURAH-COMPLETE.md (NEW)
```

## Quick Facts

| Aspect | Details |
|--------|---------|
| **Feature** | Surah Recitation with Real-time Verification |
| **Surahs Supported** | All 114 Surahs |
| **Page Size** | 5 ayahs per page |
| **Auto-Advance Delay** | 1.5 seconds after all ayahs correct |
| **Confidence Threshold** | > 80% to mark as correct |
| **Backend API** | `/api/quran/surahs`, `/api/quran/surah/{id}` |
| **WebSocket** | `/ws/recitation` for audio analysis |
| **UI Framework** | Next.js + Tailwind CSS |
| **Status Indicators** | Connected/Connecting, Recording, Pass/Fail |

## Component Hierarchy

```
ReciteSurahPage (/recite-surah)
├── Surah Selection UI
│   └── onClick → setSelectedSurah()
│
└── FullSurahRecitation (when Surah selected)
    ├── Header (Progress Bar, Page Info)
    ├── Ayah Cards (5 per page)
    │   └── AyahReciteVerify (each ayah)
    │       ├── Microphone Button
    │       ├── Audio Recorder
    │       ├── WebSocket Send
    │       └── Result Display
    └── Navigation (Previous/Next buttons)
```

## User Actions Flow

```
1. Click "Recite Surah" → go to /recite-surah
2. Select Surah from list
3. For each Ayah:
   a. Read the Arabic text
   b. Click green Mic button → start recording
   c. Recite the Ayah
   d. Click red Stop button → stop recording
   e. See result: ✅ or ❌
   f. If ❌, click Mic to retry
4. When all on page are ✅:
   → Auto-advance after 1.5 seconds
5. Repeat until Surah complete
6. See celebration screen
7. Click "Recite Another Surah" to restart
```

## Component Props & State

### ReciteSurahPage
```typescript
State:
- selectedSurah: number | null
- surahs: SurahInfo[]
- loading: boolean
```

### FullSurahRecitation
```typescript
Props:
- surahNumber: number
- onBack: () => void

State:
- ayahs: Ayah[]
- surahName: string
- currentPage: number
- ayahResults: Record<number, any>
```

### AyahReciteVerify
```typescript
Props:
- surahNumber: number
- ayahNumber: number
- ayahText: string
- onResult: (result: any) => void
- result?: any

State:
- isRecording: boolean
- mediaStream: MediaStream | null
- error: string
```

## API Integration

### GET /api/quran/surahs
```json
Response: {
  "surahs": [{
    "number": 1,
    "name": "الفاتحة",
    "englishName": "Al-Fatihah",
    "englishNameTranslation": "The Opening",
    "numberOfAyahs": 7
  }, ...]
}
```

### GET /api/quran/surah/{surah_number}
```json
Response: {
  "surah": {
    "name": "الفاتحة",
    "englishName": "Al-Fatihah",
    "revelation": "Meccan",
    "ayahs": 7
  },
  "ayahs": [{
    "number": 1,
    "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    "numberInSurah": 1
  }, ...]
}
```

### WS /ws/recitation
```json
Send: {
  "type": "audio",
  "audio": "base64_encoded_audio",
  "surahNumber": 1,
  "ayahNumber": 1
}

Receive: {
  "type": "analysis",
  "transcription": "transcribed text",
  "confidence": 0.95,
  "tajweed": {
    "errors": [],
    "score": 95
  },
  "expected": "original ayah text",
  "surahNumber": 1,
  "ayahNumber": 1
}
```

## Common Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| Microphone permission denied | Browser permission not granted | Allow in browser settings |
| No microphone found | Device not connected | Connect microphone |
| Microphone in use | Other app using it | Close other apps |
| Browser not supported | Old browser version | Update browser |
| WebSocket not connected | Backend not running | Start backend server |
| Analysis taking too long | Network issue | Check connection, reload |

## Testing Commands

```bash
# Backend
python backend/main.py

# Frontend
npm run dev

# Test URL
http://localhost:3000/recite-surah
```

## Performance Tips

1. **Browser**: Use Chrome/Firefox for best performance
2. **Microphone**: Use quality USB headset
3. **Network**: Ensure stable internet connection
4. **Environment**: Use quiet room for clear audio
5. **Pace**: Recite at natural, moderate pace

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome 80+ | ✅ Full |
| Firefox 75+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 80+ | ✅ Full |
| IE 11 | ❌ Not supported |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Start/Stop recording (when focused on button) |
| → | Next page |
| ← | Previous page |

## Responsive Breakpoints

- **Mobile**: < 640px (single column)
- **Tablet**: 640px - 1024px (optimized layout)
- **Desktop**: > 1024px (full features)

## Future Enhancements

- [ ] Save progress between sessions
- [ ] Recitation statistics dashboard
- [ ] Multiple reciter support
- [ ] Difficulty levels
- [ ] Leaderboard
- [ ] Certificate on completion
- [ ] Dark mode
- [ ] Offline support

## Support Resources

- **User Guide**: `RECITE-SURAH-GUIDE.md`
- **Technical Docs**: `SURAH-RECITATION-IMPLEMENTATION.md`
- **Complete Guide**: `RECITE-SURAH-COMPLETE.md`
- **Code**: Check component files for implementation details

## Quick Checklist for New Users

- [ ] Backend running on `localhost:8000`
- [ ] Frontend running on `localhost:3000`
- [ ] Browser supports microphone
- [ ] Microphone connected and working
- [ ] Internet connection stable
- [ ] Click "Recite Surah" from home page
- [ ] Select a Surah
- [ ] Test microphone with first Ayah
- [ ] Follow on-screen instructions
- [ ] Complete first Surah to understand flow

---

**Version**: 1.0  
**Last Updated**: March 2, 2026  
**Status**: Production Ready ✅
