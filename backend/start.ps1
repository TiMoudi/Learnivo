# Script de démarrage pour Spring Boot Backend (Windows PowerShell)

Write-Host "=== Démarrage du Backend Spring Boot ===" -ForegroundColor Green
Write-Host ""
Write-Host "Assurez-vous que MySQL est démarré et que la base de données 'courses_db' existe" -ForegroundColor Yellow
Write-Host ""

# Vérifier si Maven est installé
if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    Write-Host "Erreur: Maven n'est pas installé ou non présent dans le PATH" -ForegroundColor Red
    exit 1
}

# Démarrage avec Maven
Write-Host "Démarrage avec Maven..." -ForegroundColor Cyan
Set-Location C:\Users\pc\backend
mvn spring-boot:run

# Alternative: Utiliser le JAR construit
# java -jar target/backend-0.0.1-SNAPSHOT.jar

