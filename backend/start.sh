#!/bin/bash
# Script de démarrage pour Spring Boot Backend

echo "=== Démarrage du Backend Spring Boot ==="
echo ""
echo "Assurez-vous que MySQL est démarré et que la base de données 'courses_db' existe"
echo ""

# Option 1: Démarrage avec Maven
echo "Démarrage avec Maven..."
mvn spring-boot:run

# Sinon, utiliser le JAR construit:
# java -jar target/backend-0.0.1-SNAPSHOT.jar

