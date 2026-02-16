$env:Path += ";C:\Program Files\nodejs"
Write-Host "Added Node.js to PATH for this session." -ForegroundColor Green

Write-Host "Checking npx version..."
npx -v

if ($LASTEXITCODE -eq 0) {
    Write-Host "npx found! Starting Vercel Login..." -ForegroundColor Cyan
    cmd /c "npx vercel login"
    
    Write-Host "------------------------------------------------"
    Write-Host "Now you can deploy your project."
    Write-Host "To deploy Backend: cd server; npx vercel"
    Write-Host "To deploy Frontend: cd client; npx vercel --build-env VITE_API_URL=..."
    Write-Host "------------------------------------------------"
} else {
    Write-Host "Error: npx still not found. Please restart your computer." -ForegroundColor Red
}
