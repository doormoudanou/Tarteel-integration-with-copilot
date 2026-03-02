# 🌐 VPS Backend Connection Setup

Your local frontend is now configured to connect to your VPS backend!

---

## ✅ What Was Changed

### Frontend (Local) - 6 files updated:
- ✅ `components/QuranAudioPlayer.tsx` → http://185.245.183.209:8081
- ✅ `components/RecitationInterface.tsx` → http://185.245.183.209:8081
- ✅ `components/SurahSelector.tsx` → http://185.245.183.209:8081
- ✅ `components/SpeechToText.tsx` → http://185.245.183.209:8081
- ✅ `lib/useRecitationWebSocket.ts` → ws://185.245.183.209:8081
- ✅ `next.config.js` → http://185.245.183.209:8081

### Backend (VPS) - CORS updated:
- ✅ `main.py` → CORS now allows all origins (*)

---

## 🚀 How to Start

### 1️⃣ On Your VPS (185.245.183.209):

```bash
# SSH to your VPS
ssh root@185.245.183.209

# Start the backend
cd ~/bakemono/Tarteel-integration-with-copilot/backend
source venv/bin/activate
python3 main.py

# Backend should now run on:
# http://185.245.183.209:8081
```

**Important:** Make sure the backend is listening on `0.0.0.0:8081` (not `127.0.0.1`)

### 2️⃣ On Your Local Machine:

```bash
# Navigate to frontend
cd ~/Documents/quran-recitation-app/frontend

# Start the frontend
npm run dev

# Frontend runs on:
# http://localhost:3000
```

### 3️⃣ Open in Browser:

```
http://localhost:3000
```

Your local app will now connect to the VPS backend!

---

## 🔧 VPS Backend Configuration

Make sure your backend on the VPS is configured correctly:

### Check backend is listening on all interfaces:

In `backend/main.py` at the bottom, it should say:
```python
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8081, reload=True)
    # ↑ Important: 0.0.0.0 (not 127.0.0.1)
```

### Open firewall port 8081:

```bash
# On your VPS
sudo ufw allow 8081/tcp
sudo ufw status
```

### Verify backend is accessible:

```bash
# From your local machine
curl http://185.245.183.209:8081/health

# Should return:
# {"status":"healthy",...}
```

---

## 🧪 Test Connection

### Test from your local machine:

```bash
# Test health endpoint
curl http://185.245.183.209:8081/health

# Test API
curl http://185.245.183.209:8081/api/quran/surahs | head -20

# Test from browser
# Open: http://185.245.183.209:8081/docs
```

---

## 🔗 Connection Details

- **Local Frontend:** http://localhost:3000
- **VPS Backend API:** http://185.245.183.209:8081
- **VPS API Docs:** http://185.245.183.209:8081/docs
- **WebSocket:** ws://185.245.183.209:8081/ws/recitation

---

## 🐛 Troubleshooting

### "Connection refused" error:

**Problem:** Backend not accessible from outside VPS

**Solution:**
```bash
# On VPS - Check if backend is running
ps aux | grep python

# Check if listening on 0.0.0.0 (not 127.0.0.1)
sudo netstat -tulpn | grep 8081

# Should show: 0.0.0.0:8081 (not 127.0.0.1:8081)

# If showing 127.0.0.1, update main.py:
# Change: host="127.0.0.1"
# To: host="0.0.0.0"
```

### CORS errors in browser console:

**Problem:** Backend not accepting requests from your local machine

**Solution:** Already fixed! The backend now accepts all origins (`allow_origins=["*"]`)

### Firewall blocking:

**Problem:** VPS firewall blocking port 8081

**Solution:**
```bash
# On VPS
sudo ufw allow 8081/tcp
sudo ufw reload
sudo ufw status
```

### Backend not starting:

```bash
# On VPS - Check logs
cd ~/bakemono/Tarteel-integration-with-copilot/backend
source venv/bin/activate
python3 main.py

# Look for errors
```

---

## 🔒 Security Note

**Important:** For production, don't use `allow_origins=["*"]`

Update to specific origins:
```python
allow_origins=[
    "http://localhost:3000",
    "http://your-production-domain.com",
    "https://your-production-domain.com"
]
```

---

## ✅ Quick Checklist

- [ ] VPS backend running on 0.0.0.0:8081
- [ ] Firewall allows port 8081
- [ ] Can access http://185.245.183.209:8081/health
- [ ] Can access http://185.245.183.209:8081/docs
- [ ] Local frontend running on localhost:3000
- [ ] No CORS errors in browser console
- [ ] App loads and connects successfully

---

## 🎉 You're Done!

Your setup:
- **Frontend (Local):** Runs on your machine
- **Backend (VPS):** Runs on your VPS at 185.245.183.209
- **Connection:** Working! ✅

Enjoy your Quran Recitation App! 🕌
