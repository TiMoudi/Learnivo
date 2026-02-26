# 🚀 Guide de Démarrage - Spring Boot Backend

## ✅ Statut du Projet

- **Compilation**: ✅ BUILD SUCCESS
- **Package**: ✅ JAR créé avec succès
- **Erreurs**: ✅ Aucune erreur détectée
- **Prêt pour production**: ✅ OUI

## 📋 Prérequis

1. **MySQL** installé et en cours d'exécution
2. **Java 17+** installé
3. **Maven** installé
4. Base de données `courses_db` créée

## 🛠️ Configuration de la Base de Données

### Créer la base de données MySQL:

```sql
CREATE DATABASE IF NOT EXISTS courses_db;
USE courses_db;
```

Les tables seront créées automatiquement au premier démarrage.

### Vérifier la configuration MySQL:

Fichier: `src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/courses_db
spring.datasource.username=root
spring.datasource.password=
```

Modifiez le username et password si nécessaire.

## 🚀 Démarrage de l'Application

### Option 1: Avec Maven (Recommandé)

```powershell
cd C:\Users\pc\backend
mvn spring-boot:run
```

### Option 2: Avec le JAR

```powershell
cd C:\Users\pc\backend
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Option 3: Script PowerShell

```powershell
.\start.ps1
```

## 🌐 URLs d'Accès

Après le démarrage, l'API sera disponible à:
- **Base URL**: `http://localhost:8080`
- **API Courses**: `http://localhost:8080/api/courses`
- **H2 Console** (optionnel): `http://localhost:8080/h2-console`

## 📡 Endpoints Disponibles

### Courses

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/courses` | Récupérer tous les cours |
| GET | `/api/courses/{id}` | Récupérer un cours par ID |
| POST | `/api/courses` | Créer un nouveau cours |
| PUT | `/api/courses/{id}` | Mettre à jour un cours |
| DELETE | `/api/courses/{id}` | Supprimer un cours |
| GET | `/api/courses/category/{category}` | Récupérer par catégorie |
| GET | `/api/courses/level/{level}` | Récupérer par niveau |
| GET | `/api/courses/instructor/{instructor}` | Récupérer par instructeur |
| GET | `/api/courses/search?title=...` | Rechercher par titre |

## 📦 Format de l'Entité Course

### Exemple de requête POST:

```json
{
  "name": "Introduction to Angular",
  "level": "Beginner",
  "price": 49.99,
  "duration": "40 hours",
  "description": "Learn Angular basics",
  "instructor": "John Doe",
  "students_enrolled": 150,
  "rating": 4.5,
  "image_url": "https://example.com/image.jpg",
  "lessons": 25,
  "language": "English",
  "certificate": true,
  "startDate": "2024-03-15",
  "category": "Web Development"
}
```

### Exemple de réponse:

```json
{
  "id": 1,
  "name": "Introduction to Angular",
  "level": "Beginner",
  "price": 49.99,
  "duration": "40 hours",
  "description": "Learn Angular basics",
  "instructor": "John Doe",
  "students_enrolled": 150,
  "rating": 4.5,
  "image_url": "https://example.com/image.jpg",
  "lessons": 25,
  "language": "English",
  "certificate": true,
  "startDate": "2024-03-15",
  "category": "Web Development"
}
```

## 🧪 Test avec cURL

### Récupérer tous les cours:

```bash
curl http://localhost:8080/api/courses
```

### Créer un nouveau cours:

```bash
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Course",
    "level": "Beginner",
    "price": 29.99,
    "duration": "20 hours",
    "description": "Test description",
    "instructor": "Test Instructor",
    "category": "Programming"
  }'
```

### Récupérer un cours par ID:

```bash
curl http://localhost:8080/api/courses/1
```

### Mettre à jour un cours:

```bash
curl -X PUT http://localhost:8080/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Course Name",
    "level": "Intermediate",
    "price": 39.99,
    "duration": "30 hours",
    "description": "Updated description",
    "instructor": "Updated Instructor",
    "category": "Programming"
  }'
```

### Supprimer un cours:

```bash
curl -X DELETE http://localhost:8080/api/courses/1
```

## 🔍 Logs et Débogage

Les logs apparaîtront dans la console avec des informations sur:
- Les requêtes HTTP
- Les opérations de base de données
- Les erreurs et exceptions

Pour plus de détails, modifiez le fichier `application.properties`:

```properties
logging.level.root=INFO
logging.level.com.esprit.backend=DEBUG
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

## ⚠️ Troubleshooting

### Erreur: "Connection refused"
- Vérifiez que MySQL est démarré
- Vérifiez l'URL et les paramètres de connexion

### Erreur: "Database 'courses_db' doesn't exist"
- Créez la base de données: `CREATE DATABASE courses_db;`

### Erreur: "Port 8080 already in use"
- Changez le port dans `application.properties`: `server.port=8081`

### Erreur CORS depuis Angular
- Vérifiez que `@CrossOrigin(origins = "http://localhost:4200")` est présent dans le contrôleur

## 📁 Structure du Projet

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/esprit/backend/
│   │   │   ├── entity/
│   │   │   │   └── Course.java
│   │   │   ├── repository/
│   │   │   │   └── CourseRepository.java
│   │   │   ├── service/
│   │   │   │   └── CourseService.java
│   │   │   ├── controller/
│   │   │   │   └── CourseController.java
│   │   │   └── BackendApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/...
├── target/
│   └── backend-0.0.1-SNAPSHOT.jar
├── pom.xml
└── start.ps1
```

## 🔗 Intégration avec Angular

Utilisez le service fourni `EXAMPLE_COURSE_SERVICE.ts` dans votre projet Angular et configurez:

```typescript
private apiUrl = 'http://localhost:8080/api/courses';
```

## 📝 Notes Importantes

✅ Le CORS est configuré pour accepter les requêtes depuis `http://localhost:4200`
✅ Jackson convertit automatiquement les noms en snake_case
✅ Les propriétés nulles sont omises de la réponse JSON
✅ Hibernate crée automatiquement les tables à la première exécution

## ✉️ Support

En cas de problème:
1. Vérifiez les logs de la console
2. Consultez le fichier `application.properties`
3. Assurez-vous que MySQL est bien configuré et accessible

Bon développement! 🎉

