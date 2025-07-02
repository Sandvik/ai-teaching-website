# PowerShell script til at starte produktionsserveren
# Kør med: .\start-prod.ps1

Write-Host "🔍 Tjekker om port 3000 er i brug..." -ForegroundColor Cyan

# Funktion til at lukke processer på port 3000
function Kill-Port3000 {
    try {
        # Find processer der bruger port 3000
        $processes = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        
        if ($processes) {
            foreach ($pid in $processes) {
                $processName = (Get-Process -Id $pid -ErrorAction SilentlyContinue).ProcessName
                Write-Host "🚫 Port 3000 er i brug af proces $pid ($processName). Lukker processen..." -ForegroundColor Yellow
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            }
            Start-Sleep -Seconds 2
            Write-Host "✅ Processer lukket." -ForegroundColor Green
        } else {
            Write-Host "✅ Port 3000 er ledig." -ForegroundColor Green
        }
    }
    catch {
        Write-Host "⚠️  Kunne ikke tjekke port 3000. Fortsætter..." -ForegroundColor Yellow
    }
}

# Luk processer på port 3000
Kill-Port3000

# Build og start serveren
Write-Host "🚀 Bygger og starter serveren..." -ForegroundColor Cyan

# Tjek om npm er installeret
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm er ikke installeret eller ikke i PATH" -ForegroundColor Red
    exit 1
}

# Kør build og start
try {
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build succesfuld!" -ForegroundColor Green
        
        # Start serveren i baggrunden
        Start-Process npm -ArgumentList "start" -NoNewWindow
        
        Start-Sleep -Seconds 3
        
        # Åbn browser
        try {
            Start-Process "http://localhost:3000"
            Write-Host "🌐 Browser åbnet automatisk" -ForegroundColor Green
        }
        catch {
            Write-Host "🌐 Åbn http://localhost:3000 i din browser" -ForegroundColor Cyan
        }
        
        Write-Host "✅ Server startet! Tryk Ctrl+C for at stoppe." -ForegroundColor Green
    } else {
        Write-Host "❌ Build fejlede!" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "❌ Fejl under build/start: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} 