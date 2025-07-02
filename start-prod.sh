#!/bin/sh

# Funktion til at lukke processer på port 3000
kill_port_3000() {
  echo "🔍 Tjekker om port 3000 er i brug..."
  
  # Find processer der bruger port 3000
  if command -v lsof > /dev/null; then
    # Linux/macOS
    PID=$(lsof -ti:3000 2>/dev/null)
    if [ ! -z "$PID" ]; then
      echo "🚫 Port 3000 er i brug af proces $PID. Lukker processen..."
      kill -9 $PID 2>/dev/null
      sleep 2
      echo "✅ Proces lukket."
    else
      echo "✅ Port 3000 er ledig."
    fi
  elif command -v netstat > /dev/null; then
    # Windows (hvis netstat er tilgængelig)
    PID=$(netstat -ano | grep :3000 | grep LISTENING | awk '{print $5}' | head -1)
    if [ ! -z "$PID" ]; then
      echo "🚫 Port 3000 er i brug af proces $PID. Lukker processen..."
      kill -9 $PID 2>/dev/null
      sleep 2
      echo "✅ Proces lukket."
    else
      echo "✅ Port 3000 er ledig."
    fi
  else
    echo "⚠️  Kunne ikke tjekke port 3000. Fortsætter..."
  fi
}

# Luk processer på port 3000
kill_port_3000

# Build og start serveren
echo "🚀 Bygger og starter serveren..."
npm run build && npm start &
sleep 3

# Åbn browser
if command -v xdg-open > /dev/null; then
  xdg-open http://localhost:3000
elif command -v open > /dev/null; then
  open http://localhost:3000
else
  echo "🌐 Åbn http://localhost:3000 i din browser."
fi

echo "✅ Server startet! Tryk Ctrl+C for at stoppe." 