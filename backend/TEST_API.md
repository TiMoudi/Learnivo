# 🧪 Script de Test - API Course

## Test cURL - Linux/Mac/Git Bash

### 1. Récupérer tous les cours
```bash
curl http://localhost:8080/api/courses
```

### 2. Récupérer un cours par ID
```bash
curl http://localhost:8080/api/courses/1
```

### 3. Créer un nouveau cours
```bash
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Angular Mastery",
    "level": "Advanced",
    "price": 99.99,
    "duration": "60 hours",
    "description": "Master Angular framework",
    "instructor": "Jane Smith",
    "studentsEnrolled": 500,
    "rating": 4.8,
    "imageUrl": "https://example.com/angular.jpg",
    "lessons": 50,
    "language": "English",
    "certificate": true,
    "startDate": "2024-04-01",
    "category": "Web Development"
  }'
```

### 4. Mettre à jour un cours
```bash
curl -X PUT http://localhost:8080/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Angular Course",
    "level": "Intermediate",
    "price": 59.99,
    "duration": "45 hours",
    "description": "Updated description",
    "instructor": "John Doe",
    "studentsEnrolled": 200,
    "rating": 4.5,
    "imageUrl": "https://example.com/updated.jpg",
    "lessons": 35,
    "language": "French",
    "certificate": true,
    "startDate": "2024-03-20",
    "category": "Web Development"
  }'
```

### 5. Supprimer un cours
```bash
curl -X DELETE http://localhost:8080/api/courses/1
```

### 6. Récupérer les cours par catégorie
```bash
curl "http://localhost:8080/api/courses/category/Web Development"
```

### 7. Récupérer les cours par niveau
```bash
curl http://localhost:8080/api/courses/level/Beginner
```

### 8. Récupérer les cours par instructeur
```bash
curl "http://localhost:8080/api/courses/instructor/John Doe"
```

### 9. Rechercher les cours par titre
```bash
curl "http://localhost:8080/api/courses/search?title=Angular"
```

---

## Test PowerShell (Windows)

### 1. Récupérer tous les cours
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/courses" -Method Get
```

### 2. Créer un nouveau cours
```powershell
$body = @{
    name = "Spring Boot Basics"
    level = "Beginner"
    price = 49.99
    duration = "40 hours"
    description = "Learn Spring Boot fundamentals"
    instructor = "Mike Johnson"
    studentsEnrolled = 300
    rating = 4.6
    imageUrl = "https://example.com/spring.jpg"
    lessons = 30
    language = "English"
    certificate = $true
    startDate = "2024-03-01"
    category = "Backend"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/courses" `
  -Method Post `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

### 3. Mettre à jour un cours
```powershell
$body = @{
    name = "Updated Spring Boot"
    level = "Intermediate"
    price = 79.99
    duration = "60 hours"
    description = "Advanced Spring Boot"
    instructor = "Mike Johnson"
    studentsEnrolled = 400
    rating = 4.7
    imageUrl = "https://example.com/spring-updated.jpg"
    lessons = 45
    language = "English"
    certificate = $true
    startDate = "2024-03-15"
    category = "Backend"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/courses/1" `
  -Method Put `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

### 4. Supprimer un cours
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/courses/1" -Method Delete
```

---

## Test avec Postman

1. **Ouvrir Postman**
2. **Créer une nouvelle collection** "Course API"

### Requêtes Postman

#### GET - Tous les cours
- **URL**: `http://localhost:8080/api/courses`
- **Méthode**: GET
- **Headers**: Aucun requis

#### POST - Créer un cours
- **URL**: `http://localhost:8080/api/courses`
- **Méthode**: POST
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "name": "React Basics",
  "level": "Beginner",
  "price": 39.99,
  "duration": "30 hours",
  "description": "Learn React fundamentals",
  "instructor": "Sarah Williams",
  "studentsEnrolled": 250,
  "rating": 4.4,
  "imageUrl": "https://example.com/react.jpg",
  "lessons": 25,
  "language": "English",
  "certificate": true,
  "startDate": "2024-03-10",
  "category": "Frontend"
}
```

#### PUT - Mettre à jour un cours
- **URL**: `http://localhost:8080/api/courses/1`
- **Méthode**: PUT
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON): Identique à POST avec modifications

#### DELETE - Supprimer un cours
- **URL**: `http://localhost:8080/api/courses/1`
- **Méthode**: DELETE

#### GET - Filtrer par catégorie
- **URL**: `http://localhost:8080/api/courses/category/Web Development`
- **Méthode**: GET

#### GET - Filtrer par niveau
- **URL**: `http://localhost:8080/api/courses/level/Beginner`
- **Méthode**: GET

#### GET - Rechercher par titre
- **URL**: `http://localhost:8080/api/courses/search?title=Angular`
- **Méthode**: GET

---

## Réponses Attendues

### Succès 200 OK
```json
{
  "id": 1,
  "name": "Angular Course",
  "level": "Beginner",
  "price": 49.99,
  "duration": "40 hours",
  "description": "Learn Angular basics",
  "instructor": "John Doe",
  "studentsEnrolled": 150,
  "rating": 4.5,
  "imageUrl": "https://example.com/angular.jpg",
  "lessons": 25,
  "language": "English",
  "certificate": true,
  "startDate": "2024-03-15",
  "category": "Web Development"
}
```

### Créé 201 Created
La réponse inclut le nouvel objet avec `id` généré.

### Supprimé 204 No Content
Pas de contenu de réponse.

### Non trouvé 404 Not Found
```json
{
  "error": "Not Found"
}
```

---

## Codes de Statut HTTP

| Code | Signification |
|------|--------------|
| 200 | OK - Requête réussie |
| 201 | Created - Ressource créée |
| 204 | No Content - Suppression réussie |
| 400 | Bad Request - Données invalides |
| 404 | Not Found - Ressource non trouvée |
| 500 | Internal Server Error - Erreur serveur |

---

**Astuce**: Gardez cette liste à côté de vous pour tester rapidement votre API!

