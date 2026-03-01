#!/bin/bash

echo "🗑️  Clearing Quran cache to reload with full tashkeel..."
rm -rf /home/bakemono/Documents/quran-recitation-app/backend/cache/*.json

echo "✅ Cache cleared!"
echo ""
echo "🔄 Now restart the backend with:"
echo "  cd /home/bakemono/Documents/quran-recitation-app/backend"
echo "  source venv/bin/activate"
echo "  python main.py"
echo ""
echo "The backend will automatically download Quran with full harakats!"
