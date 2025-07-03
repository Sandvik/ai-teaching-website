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
      echo "⏳ Venter på at processen lukker..."
      sleep 5
      
      # Tjek om processen stadig kører
      if lsof -ti:3000 >/dev/null 2>&1; then
        echo "⚠️  Processen kører stadig. Prøver igen..."
        PID=$(lsof -ti:3000 2>/dev/null)
        kill -9 $PID 2>/dev/null
        sleep 3
      fi
      
      # Final tjek
      if lsof -ti:3000 >/dev/null 2>&1; then
        echo "❌ Kunne ikke lukke processen på port 3000. Prøv at lukke den manuelt."
        exit 1
      else
        echo "✅ Proces lukket og port 3000 er ledig."
      fi
    else
      echo "✅ Port 3000 er ledig."
    fi
  elif command -v netstat > /dev/null; then
    # Windows (hvis netstat er tilgængelig)
    PID=$(netstat -ano | grep :3000 | grep LISTENING | awk '{print $5}' | head -1)
    if [ ! -z "$PID" ]; then
      echo "🚫 Port 3000 er i brug af proces $PID. Lukker processen..."
      kill -9 $PID 2>/dev/null
      echo "⏳ Venter på at processen lukker..."
      sleep 5
      
      # Tjek om processen stadig kører
      if netstat -ano | grep :3000 | grep LISTENING >/dev/null 2>&1; then
        echo "⚠️  Processen kører stadig. Prøver igen..."
        PID=$(netstat -ano | grep :3000 | grep LISTENING | awk '{print $5}' | head -1)
        kill -9 $PID 2>/dev/null
        sleep 3
      fi
      
      # Final tjek
      if netstat -ano | grep :3000 | grep LISTENING >/dev/null 2>&1; then
        echo "❌ Kunne ikke lukke processen på port 3000. Prøv at lukke den manuelt."
        exit 1
      else
        echo "✅ Proces lukket og port 3000 er ledig."
      fi
    else
      echo "✅ Port 3000 er ledig."
    fi
  else
    echo "⚠️  Kunne ikke tjekke port 3000. Fortsætter..."
  fi
}

# Funktion til at vente på at port 3000 er ledig
wait_for_port() {
  echo "⏳ Venter på at port 3000 bliver ledig..."
  for i in {1..30}; do
    if command -v lsof > /dev/null; then
      if ! lsof -ti:3000 >/dev/null 2>&1; then
        echo "✅ Port 3000 er nu ledig!"
        return 0
      fi
    elif command -v netstat > /dev/null; then
      if ! netstat -ano | grep :3000 | grep LISTENING >/dev/null 2>&1; then
        echo "✅ Port 3000 er nu ledig!"
        return 0
      fi
    fi
    sleep 1
  done
  echo "❌ Port 3000 er stadig i brug efter 30 sekunder."
  return 1
}

# Luk processer på port 3000
kill_port_3000

# Vent på at porten er ledig
wait_for_port

# Build og start serveren
echo "🚀 Bygger og starter serveren..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build fejlede!"
  exit 1
fi

echo "🚀 Starter serveren..."
npm start &
SERVER_PID=$!

# Vent lidt og tjek om serveren startede
sleep 5
if ! kill -0 $SERVER_PID 2>/dev/null; then
  echo "❌ Serveren kunne ikke starte!"
  exit 1
fi

# Åbn browser
if command -v xdg-open > /dev/null; then
  xdg-open http://localhost:3000
elif command -v open > /dev/null; then
  open http://localhost:3000
else
  echo "🌐 Åbn http://localhost:3000 i din browser."
fi

echo "✅ Server startet! Tryk Ctrl+C for at stoppe."
echo "📊 Server PID: $SERVER_PID"

# Vent på at brugeren stopper serveren
wait $SERVER_PID 