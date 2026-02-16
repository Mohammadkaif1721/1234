$env:Path += ";C:\Program Files\Git\cmd"
Write-Host "Added Git to PATH for this session." -ForegroundColor Green

# Configure Git User (Required for commit)
git config --global user.email "ramesh@sreyas.ac.in"
git config --global user.name "ramkore"

# Initialize
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..."
    git init
}

# Add Remote
# Check if remote exists
git remote remove origin 2>$null
git remote add origin https://github.com/ramkore/Event.git
Write-Host "Added remote origin."

# Add & Commit
git add .
git commit -m "Initial commit of Bellcorp Event Management Application"

# Rename branch to main
git branch -M main

# Push
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed. You might need to authenticate." -ForegroundColor Yellow
    Write-Host "Try running: 'git push -u origin main' manually."
}
else {
    Write-Host "Successfully pushed to GitHub!" -ForegroundColor Green
}
