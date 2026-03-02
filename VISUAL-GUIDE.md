# 📱 Recite Surah Feature - Visual Guide

## 🏠 Home Page Updates

### Navigation Menu
```
┌─────────────────────────────────────────────────────────┐
│  Quran Recitation    [Start Reciting] [Recite Surah] ... │
└─────────────────────────────────────────────────────────┘
                              ↑ NEW
```

The new **"Recite Surah"** button appears in the main navigation header.

---

## 📖 Surah Selection Page (`/recite-surah`)

### Layout
```
┌──────────────────────────────────────────────────────┐
│            Select a Surah to Recite                  │
│  Choose from the list below and begin your practice. │
│                                                       │
│  ┌──────────────────────────────────────────────┐   │
│  │ 1  Al-Fatihah        "The Opening"           │   │
│  │    الفاتحة                          7 Ayahs  │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │ 2  Al-Baqarah        "The Cow"               │   │
│  │    البقرة                          286 Ayahs │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │ 3  Ali Imran         "The Family of Imran"   │   │
│  │    آل عمران                       200 Ayahs │   │
│  └──────────────────────────────────────────────┘   │
│  ...                                                  │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Features:**
- Scrollable list with all 114 Surahs
- Click any Surah to start reciting
- Shows number, name, translation, and ayah count

---

## 🎯 Surah Recitation Page

### Header Section
```
┌──────────────────────────────────────────────────────┐
│            Al-Fatihah                                │
│   Surah 1 • 7 Ayahs (Meccan)                         │
│                                                       │
│  4 of 7 ayahs completed    ▌▌▌▌░░  57%              │
│  ════════════════════════════════════════            │
│  Page 1 of 1                                          │
└──────────────────────────────────────────────────────┘
```

**Components:**
- Surah title and details
- Progress bar (visual and percentage)
- Page counter

### Ayah Cards
```
┌──────────────────────────────────────────────────────┐
│ Ayah 1  ✓ Connected                                  │
│                                                       │
│ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ              │
│                                                       │
│ ┌─────────────────────────────────────────────────┐ │
│ │            🎤                  Recording...     │ │
│ │         [RED BUTTON]                           │ │
│ │         (Stop Recording)         ✅ Correct    │ │
│ └─────────────────────────────────────────────────┘ │
│                                                       │
│ Confidence: 95%                                      │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ Ayah 2  ✓ Connected                                  │
│                                                       │
│ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ              │
│                                                       │
│ ┌─────────────────────────────────────────────────┐ │
│ │            🎤                                   │ │
│ │         [GREEN BUTTON]                         │ │
│ │         (Start Recording)                      │ │
│ └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ Ayah 3  ✓ Connected                                  │
│                                                       │
│ الرَّحْمَٰنِ الرَّحِيمِ                             │
│                                                       │
│ ┌─────────────────────────────────────────────────┐ │
│ │            🎤                                   │ │
│ │         [GREEN BUTTON]                         │ │
│ │         (Start Recording)     ❌ Try Again     │ │
│ └─────────────────────────────────────────────────┘ │
│                                                       │
│ Tajweed Issues:                                      │
│  • Makhraj: 'د' (Expected D, got closer to T)       │
│  • Madd: Alif should be elongated more              │
└──────────────────────────────────────────────────────┘
```

**Color Coding:**
- 🟢 **Green border** = ✅ Correct
- 🔴 **Red border** = ❌ Try Again
- ⚪ **Gray border** = Not attempted

### Navigation Section
```
┌──────────────────────────────────────────────────────┐
│  [← Previous Page]           [Next Page →]           │
└──────────────────────────────────────────────────────┘
```

---

## 🎤 Recording Process

### Step 1: Ready to Record
```
┌─────────────────────┐
│                     │
│   🎤 Green Button   │  Click to START
│   (Ready)           │
│                     │
└─────────────────────┘
```

### Step 2: Recording
```
┌─────────────────────┐
│  ⏹️  Red Button    │  Recording...
│  (Stop)             │  ⏳ ⏳ ⏳
│                     │
│  🔴 RECORDING       │
└─────────────────────┘
```

### Step 3: Processing
```
┌─────────────────────┐
│                     │
│    ⚙️  Processing   │  Analyzing your
│                     │  recitation...
│    (Sending audio)  │
│                     │
└─────────────────────┘
```

### Step 4: Result
```
Option A: CORRECT
┌─────────────────────┐
│                     │
│    ✅ CORRECT       │
│                     │
│   Confidence: 95%   │
│                     │
└─────────────────────┘

Option B: TRY AGAIN
┌─────────────────────┐
│                     │
│   ❌ TRY AGAIN      │
│                     │
│   Tajweed Issues:   │
│   • Makhraj: D→T    │
│   • Madd: short     │
│                     │
└─────────────────────┘
```

---

## 📊 Progress Indicators

### Connection Status
```
✓ Connected ......... Ready to record
⏳ Connecting ....... Waiting for server
❌ Disconnected .... Cannot record
```

### Ayah Status
```
✅ Correct .......... Green border, can move on
❌ Try Again ....... Red border, can retry
⚪ Not Attempted .. Gray border, waiting
⏳ Recording ...... Microphone active
⚙️  Processing ...... Analyzing audio
```

---

## 🚀 Auto-Advance Animation

### When Page is Complete
```
Step 1: All Ayahs Verified
┌──────────────────────────────────────────────────────┐
│  All ayahs on this page verified! ✅                 │
│  Moving to next page...                              │
│  ↓ ↓ ↓  (bouncing animation)                        │
└──────────────────────────────────────────────────────┘

Step 2: Auto-Advance Starts (1.5 seconds)
Page changes automatically...

Step 3: Next Page Loads
New set of 5 ayahs appears
```

---

## 🎉 Completion Screen

### When Surah is Complete
```
┌──────────────────────────────────────────────────────┐
│                                                       │
│                      🎉 🎉 🎉                        │
│                                                       │
│         SURAH COMPLETE!                              │
│                                                       │
│  Masha'Allah! You have successfully recited          │
│  all 7 ayahs of Al-Fatihah.                          │
│                                                       │
│  Accuracy: 100%                                      │
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │  [Recite Another Surah]                     │   │
│  └─────────────────────────────────────────────┘   │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## ⚠️ Error Messages

### Microphone Permission
```
┌──────────────────────────────────────────────────────┐
│ 🚫 Microphone permission denied.                     │
│                                                       │
│ Please allow microphone access in your browser       │
│ settings and try again.                              │
│                                                       │
│ Steps:                                               │
│ 1. Check browser notification in top-left            │
│ 2. Click "Allow" for microphone                      │
│ 3. Reload this page                                  │
│ 4. Try recording again                              │
└──────────────────────────────────────────────────────┘
```

### No Microphone Found
```
┌──────────────────────────────────────────────────────┐
│ 🚫 No microphone found on your device.               │
│                                                       │
│ Please connect a microphone and try again.           │
│                                                       │
│ Check:                                               │
│ • Microphone is plugged in                           │
│ • USB ports are working                              │
│ • Device settings show microphone                    │
└──────────────────────────────────────────────────────┘
```

### WebSocket Connection Error
```
┌──────────────────────────────────────────────────────┐
│ ⏳ Connecting...                                      │
│                                                       │
│ Waiting for server connection...                     │
│ (Will auto-retry every 3 seconds)                    │
│                                                       │
│ If this persists:                                    │
│ • Check backend is running                           │
│ • Reload the page                                    │
│ • Check your internet connection                     │
└──────────────────────────────────────────────────────┘
```

---

## 📱 Mobile View

### Surah Selection (Mobile)
```
┌──────────────────────┐
│ ← Recite Surah       │
│ Select a Surah       │
│ ──────────────────── │
│                      │
│ ┌──────────────────┐ │
│ │ 1                │ │
│ │ Al-Fatihah       │ │
│ │ 7 Ayahs          │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ 2                │ │
│ │ Al-Baqarah       │ │
│ │ 286 Ayahs        │ │
│ └──────────────────┘ │
│                      │
│ (Scrollable)         │
│                      │
└──────────────────────┘
```

### Recitation (Mobile)
```
┌──────────────────────┐
│ ← Back               │
│                      │
│ Al-Fatihah          │
│ 3/7 ▌▌▌░░ 43%      │
│                      │
│ Ayah 1              │
│ ──────────────────── │
│ بِسْمِ اللَّهِ      │
│                      │
│ ┌──────────────────┐ │
│ │      🎤          │ │
│ │   [GREEN BTN]    │ │
│ │  Tap to Record   │ │
│ └──────────────────┘ │
│                      │
│ [← Prev] [Next →]   │
└──────────────────────┘
```

---

## 🎯 User Journey Map

```
┌─────────────────────────────────────────────────────┐
│  HOME PAGE                                          │
│  Click "Recite Surah"                               │
│         ↓                                           │
├─────────────────────────────────────────────────────┤
│  SURAH SELECTION                                    │
│  Browse & select Surah                              │
│  Click a Surah                                      │
│         ↓                                           │
├─────────────────────────────────────────────────────┤
│  RECITATION PAGE (Page 1)                           │
│  See 5 ayahs, record each one                       │
│  Get instant feedback                               │
│  Repeat until all are ✅                            │
│         ↓ (Auto-advance)                           │
├─────────────────────────────────────────────────────┤
│  RECITATION PAGE (Page 2)                           │
│  Continue with next batch of ayahs                  │
│  Same process                                       │
│         ↓ (Auto-advance)                           │
├─────────────────────────────────────────────────────┤
│  ...                                                │
│  (Repeat for all pages)                             │
│         ↓                                           │
├─────────────────────────────────────────────────────┤
│  COMPLETION SCREEN                                  │
│  See celebration message                            │
│  Option: "Recite Another Surah"                     │
│         ↓                                           │
│  Back to SURAH SELECTION (restart cycle)           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## ⏱️ Timeline for Typical Session

```
Action                          Time
─────────────────────────────   ──────
1. Select Surah                 5 sec
2. Load Surah data              2 sec
3. Record Ayah 1                5-10 sec
4. Process & verify             2 sec
5. View result                  1 sec
6. Repeat Ayahs 2-5             20-50 sec
7. Wait for auto-advance        1.5 sec
8. Load next page               2 sec
─────────────────────────────────────
Total per page:                 ~40-80 sec
                                
For 7-ayah Surah (2 pages):     ~80-160 sec (1-3 min)
For long Surah (10 pages):      ~400-800 sec (6-13 min)
```

---

## 🎮 Interactive Elements

### Buttons & Their States

**Recording Button:**
- 🟢 **Green** → Click to start recording (enabled when connected)
- 🔴 **Red** → Click to stop recording (enabled while recording)
- ⚪ **Gray** → Disabled (when disconnected or ayah already verified)

**Navigation Buttons:**
- ← **Previous Page** → Disabled on first page, enabled otherwise
- **Next Page** → → Disabled on last page, enabled otherwise
- Both disabled on mobile landscape

**Action Buttons:**
- ← **Back** → Return to Surah selection
- **Recite Another Surah** → Restart with selection screen

---

This visual guide shows exactly what users will see and experience when using the Recite Surah feature! 🎯

