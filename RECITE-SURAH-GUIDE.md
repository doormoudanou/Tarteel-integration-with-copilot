# Surah Recitation Feature - User Guide

## Overview

The **Recite Surah** feature allows you to practice reciting entire Quranic Surahs with real-time verification and feedback. This is similar to the Tarteel app and provides ayah-by-ayah analysis with Tajweed correction.

## How to Use

### 1. **Starting the Feature**
- Navigate to the home page and click the **"Recite Surah"** button in the navigation menu
- Alternatively, go to `/recite-surah` in your browser

### 2. **Selecting a Surah**
- You'll see a list of all 114 Surahs
- Each Surah shows:
  - Number
  - Arabic name
  - English name and translation
  - Total number of ayahs
- Click on any Surah to begin recitation

### 3. **Reciting the Surah**
Once you've selected a Surah, you'll see:

#### Page Layout:
- **Header**: Shows Surah name, number, total ayahs, and revelation type (Meccan/Medinan)
- **Progress Bar**: Displays your progress through the Surah (percentage complete)
- **Ayahs**: Multiple ayahs displayed on one page (5 per page for longer surahs)
- **Navigation**: Previous/Next buttons to move between pages

#### Recording an Ayah:
1. Read the Arabic text displayed for each ayah
2. Click the **green microphone button** to start recording
3. Recite the ayah clearly and naturally
4. Click the **red stop button** when finished
5. The app will analyze your recitation and display results immediately

### 4. **Understanding Results**

#### Color-Coded Feedback:
- **Green Border** (✅ Correct): Your recitation is accurate
- **Red Border** (❌ Try Again): Your recitation needs improvement
- **Gray Border**: Not yet attempted

#### Feedback Details:
- **Confidence Score**: Shows how well the app recognized your speech (in percentage)
- **Tajweed Issues**: Lists any Tajweed (recitation rules) violations:
  - Type of error
  - Expected pronunciation
  - What was received
- **Status**: Shows whether you're ready to move to the next ayah

### 5. **Automatic Page Progression**

Once you've successfully recited all ayahs on a page:
- The app automatically waits 1.5 seconds
- A blue message appears: "Moving to next page..."
- The next page loads automatically
- You can manually skip to the next page anytime using the "Next Page" button

### 6. **Completing a Surah**

When you've successfully recited all ayahs in a Surah:
- A celebration message appears with a completion percentage
- Option to recite another Surah
- You can go back and select a different Surah

---

## Troubleshooting

### 🎤 Microphone Not Working

**Error: "Could not access microphone..."**

**Possible Causes & Solutions:**

1. **Permission Denied**
   - Open browser settings → Site permissions → Microphone
   - Allow microphone access for this website
   - Reload the page and try again

2. **No Microphone Detected**
   - Check that your microphone is plugged in and working
   - Try on a different browser or device
   - Open Settings > Privacy > Microphone to verify the device is enabled

3. **Microphone in Use**
   - Close other apps using your microphone (Zoom, Teams, Discord, etc.)
   - Wait a few seconds and try again
   - Restart your browser if needed

4. **Browser Not Supported**
   - Use a modern browser: Chrome, Firefox, Safari, or Edge
   - Older versions of browsers may not support microphone access
   - Update your browser to the latest version

### ⏳ WebSocket Connection Error

**Error: "Connecting..." status stays for a long time**

**Solutions:**
- Refresh the page
- Check that the backend API is running (`http://localhost:8000` should be accessible)
- Check your internet connection
- Wait 30 seconds for automatic reconnection attempt

### ❌ Recitation Verification Issues

**Getting "Try Again" too often?**

- Speak clearly and at a natural pace
- Ensure you're in a quiet environment with minimal background noise
- Use proper Tajweed pronunciation
- Make sure your microphone volume is adequate
- Try reciting the ayah again with proper emphasis on accent marks

### 📝 Analysis Not Appearing

**Solutions:**
- Ensure WebSocket is connected (check status indicator)
- Verify backend is running
- Check browser console for errors (F12 → Console tab)
- Try refreshing the page

---

## Best Practices for Best Results

1. **Environment**
   - Recite in a quiet room
   - Close other applications using audio
   - Use a quality microphone (headset preferred)

2. **Pronunciation**
   - Follow proper Tajweed rules
   - Pronounce each letter clearly
   - Maintain proper pace (not too fast, not too slow)
   - Pay attention to elongation (Madd) marks

3. **Recording**
   - Click the microphone button immediately before reciting
   - Recite the entire ayah without pausing
   - Click stop when you've finished the ayah completely
   - Wait for the analysis to complete before moving on

4. **Progression**
   - Don't rush - focus on accuracy first
   - If you get "Try Again", review your pronunciation
   - Take breaks if needed
   - You can recite the same Surah multiple times to improve

---

## System Requirements

- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Microphone**: Built-in or external USB microphone
- **Internet**: Stable connection required for WebSocket and API calls
- **Permissions**: Allow microphone access when prompted

---

## Features

✅ Real-time recitation verification  
✅ Tajweed rule checking and feedback  
✅ Progress tracking (percentage complete)  
✅ Automatic page progression  
✅ Multiple reciters support (Al-Afasy selected by default)  
✅ Beautiful, responsive UI  
✅ Instant confidence scoring  
✅ Detailed error reporting  
✅ All 114 Surahs supported  
✅ Mobile-friendly design  

---

## Support

If you encounter persistent issues:
1. Check browser console (F12 → Console)
2. Verify backend is running
3. Check that microphone permissions are granted
4. Try a different browser
5. Clear browser cache and cookies
6. Restart your device

---

**Happy Reciting! 📖✨**
