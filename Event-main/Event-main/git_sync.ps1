$env:Path += ";C:\Program Files\Git\cmd"

Write-Host "Configuring Credential Helper..."
git config --global credential.helper manager

Write-Host "Pulling remote changes (keeping local files if conflict)..."
# Pull remote/main into local/main. 
# --allow-unrelated-histories needed because they started separately.
# -X ours: If README exists in both, keep the one we just made locally.
git pull origin main --allow-unrelated-histories -X ours --no-edit

if ($LASTEXITCODE -eq 0) {
    Write-Host "Pull successful. Now pushing..." -ForegroundColor Cyan
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SUCCESS! Project uploaded to GitHub." -ForegroundColor Green
    }
    else {
        Write-Host "Push failed. A popup should have appeared for login." -ForegroundColor Yellow
        Write-Host "If no popup appeared, you may need to use a Personal Access Token."
    }
}
else {
    Write-Host "Pull failed. Please check the error message above." -ForegroundColor Red
}
