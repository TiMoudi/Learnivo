# Résumé - Intégration Angular et Spring Boot pour Course

## Étapes Complétées

### 1. Entité Course (Java)
L'entité a été mise à jour pour inclure tous les champs de l'interface Angular:
- id, name, level, price, duration, description, instructor
- students_enrolled, rating, image_url, lessons, language
- certificate, startDate, category

### 2. Repository
Méthodes de recherche:
- findByCategory, findByLevel, findByInstructor, findByNameContainingIgnoreCase

### 3. Service
- CRUD complet
- Recherche par catégorie, niveau, instructeur, nom
- Gestion transactionnelle

### 4. Controller REST
Endpoints disponibles:
- GET /api/courses - tous
- GET /api/courses/{id} - par ID
- POST /api/courses - créer
- PUT /api/courses/{id} - modifier
- DELETE /api/courses/{id} - supprimer
- GET /api/courses/category/{category}
- GET /api/courses/level/{level}
- GET /api/courses/instructor/{instructor}
- GET /api/courses/search?title=...

CORS activé pour http://localhost:4200

### 5. Configuration MySQL
- URL: jdbc:mysql://localhost:3306/courses_db
- Auto-update schema
- Jackson pour snake_case
- Port: 8080

## Mappage des Champs

Angular -> Java -> Base de Données
- name -> name -> name
- students_enrolled -> studentsEnrolled -> students_enrolled
- image_url -> imageUrl -> image_url
- startDate -> startDate -> start_date

## Prochaines Étapes

1. Créer la base de données: CREATE DATABASE courses_db;
2. Démarrer: mvn spring-boot:run
3. La table courses sera créée automatiquement
4. Tester: http://localhost:8080/api/courses
5. Copier le service Angular fourni en exemple

