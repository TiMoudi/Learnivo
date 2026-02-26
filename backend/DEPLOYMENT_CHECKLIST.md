# ✅ Checklist de Déploiement - Spring Boot Course API

## 🔍 Vérifications Avant Démarrage

### Configuration
- [ ] MySQL est installé et en cours d'exécution
- [ ] Base de données `courses_db` créée
- [ ] Paramètres de connexion MySQL dans `application.properties` sont corrects
- [ ] Java 17 ou supérieur est installé
- [ ] Maven est installé et accessible via la ligne de commande

### Fichiers
- [ ] `src/main/java/com/esprit/backend/entity/Course.java` existe
- [ ] `src/main/java/com/esprit/backend/repository/CourseRepository.java` existe
- [ ] `src/main/java/com/esprit/backend/service/CourseService.java` existe
- [ ] `src/main/java/com/esprit/backend/controller/CourseController.java` existe
- [ ] `src/main/resources/application.properties` est configuré
- [ ] `pom.xml` contient toutes les dépendances

### Compilation
- [ ] `mvn clean compile` s'exécute sans erreur
- [ ] `mvn package -DskipTests` crée le JAR
- [ ] Aucune erreur de syntaxe Java
- [ ] Aucune erreur d'import manquant

## 🚀 Démarrage de l'Application

### Avant le démarrage
```bash
cd C:\Users\pc\backend
```

### Étape 1: Vérifier la base de données
```sql
-- Dans MySQL
CREATE DATABASE IF NOT EXISTS courses_db;
SHOW DATABASES;
```

### Étape 2: Compiler le projet
```bash
mvn clean compile
```
- [ ] Compilation réussie

### Étape 3: Construire le package
```bash
mvn package -DskipTests
```
- [ ] JAR créé dans `target/backend-0.0.1-SNAPSHOT.jar`

### Étape 4: Démarrer l'application
```bash
mvn spring-boot:run
```

Ou avec le JAR:
```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

- [ ] Application démarrée sans erreur
- [ ] Message "Started BackendApplication" dans les logs

## 🌐 Vérification des Endpoints

### Test de connectivité
```bash
curl http://localhost:8080/api/courses
```
- [ ] Réponse HTTP 200 OK
- [ ] Retourne un tableau JSON (peut être vide)

### Tests de base (avec Postman/cURL)

#### GET tous les cours
```bash
curl http://localhost:8080/api/courses
```
- [ ] Status: 200 OK
- [ ] Réponse: Array []

#### POST - Créer un cours
```bash
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Course",
    "level": "Beginner",
    "price": 29.99,
    "duration": "20 hours",
    "description": "Test",
    "instructor": "Test Instructor",
    "category": "Test"
  }'
```
- [ ] Status: 201 Created
- [ ] Réponse contient `id`
- [ ] Enregistrement créé dans la BD

#### GET par ID
```bash
curl http://localhost:8080/api/courses/1
```
- [ ] Status: 200 OK
- [ ] Retourne le cours créé

#### PUT - Mettre à jour
```bash
curl -X PUT http://localhost:8080/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Course",
    "level": "Intermediate",
    "price": 49.99,
    "duration": "40 hours",
    "description": "Updated",
    "instructor": "Updated Instructor",
    "category": "Test"
  }'
```
- [ ] Status: 200 OK
- [ ] Les données sont mises à jour

#### DELETE
```bash
curl -X DELETE http://localhost:8080/api/courses/1
```
- [ ] Status: 204 No Content
- [ ] Course supprimée de la BD

## 🔗 Intégration Angular

### Configuration Angular
- [ ] Importer `HttpClientModule` dans `app.module.ts`
- [ ] Créer le service `course.service.ts`
- [ ] Configurer l'URL: `http://localhost:8080/api/courses`

### Tests d'intégration
- [ ] Service Angular récupère les cours
- [ ] Affichage correct dans le tableau
- [ ] Création de cours fonctionnelle
- [ ] Modification de cours fonctionnelle
- [ ] Suppression de cours fonctionnelle

## 🛡️ Sécurité et Configuration

### CORS
- [ ] `@CrossOrigin(origins = "http://localhost:4200")` est actif
- [ ] Les requêtes d'Angular sont acceptées

### Validation
- [ ] Les champs obligatoires sont validés
- [ ] Les erreurs sont gérées correctement
- [ ] Les messages d'erreur sont clairs

### Base de Données
- [ ] Table `courses` créée avec les bonnes colonnes
- [ ] Les constraints sont respectées (NOT NULL, etc.)
- [ ] Les types de données sont corrects

## 📊 Monitoring et Logs

### Logs
- [ ] Console affiche les logs DEBUG
- [ ] Les requêtes SQL sont visibles
- [ ] Pas d'erreurs warnings

### Performances
- [ ] Les requêtes répondent rapidement (< 500ms)
- [ ] La connexion BD est stable
- [ ] Pas de fuite mémoire (monitoring)

## 🚨 Troubleshooting

### Problème: Port 8080 déjà utilisé
```bash
# Vérifier quel processus utilise le port
netstat -ano | findstr :8080

# Ou changer le port dans application.properties
server.port=8081
```
- [ ] Port changé si nécessaire

### Problème: Connexion BD refusée
```bash
# Vérifier MySQL
mysql -u root -p

# Vérifier les identifiants dans application.properties
```
- [ ] Connexion BD établie

### Problème: CORS error
```
# Vérifier que @CrossOrigin est configuré correctement
# Vérifier l'URL Angular
```
- [ ] CORS configuration corrigée

## 📈 Métriques Finales

- [ ] ✅ Compilation: SUCCESS
- [ ] ✅ Package créé: JAR existant
- [ ] ✅ Démarrage: Sans erreur
- [ ] ✅ API fonctionnelle: Tous les endpoints fonctionnent
- [ ] ✅ Base de données: Connectée et opérationnelle
- [ ] ✅ CORS: Configuré pour Angular
- [ ] ✅ Logs: Clairs et informatifs
- [ ] ✅ Documentation: Fournie

## 🎯 Prochaines Étapes

1. [ ] Déployer sur serveur de développement
2. [ ] Configurer environnement de production
3. [ ] Mettre en place CI/CD
4. [ ] Ajouter tests unitaires
5. [ ] Ajouter tests d'intégration
6. [ ] Documenter API avec Swagger
7. [ ] Mettre en cache les requêtes fréquentes
8. [ ] Ajouter authentification/autorisation

## 📞 Support

En cas de problème:
1. Vérifier les logs de la console
2. Consulter `STARTUP_GUIDE.md`
3. Consulter `TEST_API.md`
4. Vérifier la configuration MySQL

---

**Date de vérification**: _______________
**Responsable**: _______________
**Status**: ✅ PRÊT POUR LA PRODUCTION

---

**Félicitations! Votre API Spring Boot est opérationnelle! 🎉**

