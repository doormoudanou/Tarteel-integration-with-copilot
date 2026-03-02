#!/bin/bash

# Script to update all port references from 8000 to 8081

echo "🔄 Updating all references from port 8000 to 8081..."

# Find all markdown and script files and update them
find . -type f \( -name "*.md" -o -name "*.sh" \) -not -path "*/node_modules/*" -not -path "*/.git/*" -exec sed -i 's/:8000/:8081/g' {} +
find . -type f \( -name "*.md" -o -name "*.sh" \) -not -path "*/node_modules/*" -not -path "*/.git/*" -exec sed -i 's/8000:/8081:/g' {} +
find . -type f \( -name "*.md" -o -name "*.sh" \) -not -path "*/node_modules/*" -not -path "*/.git/*" -exec sed -i 's/port 8000/port 8081/g' {} +

echo "✅ All documentation updated to use port 8081"
echo ""
echo "Updated files include:"
echo "  - All .md documentation files"
echo "  - All .sh scripts"
echo "  - Docker configurations"
echo ""
echo "Backend now runs on: http://localhost:8081"
echo "Frontend runs on: http://localhost:3000"
