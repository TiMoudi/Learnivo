# Spring Boot Backend - Course API

## Configuration et Démarrage

### 1. Configuration de la Base de Données

Créez une base de données MySQL nommée `courses_db`:

```sql
CREATE DATABASE courses_db;
```

Modifiez les paramètres de connexion dans `application.properties` si nécessaire:
- URL: `jdbc:mysql://localhost:3306/courses_db`
- Username: `root`
- Password: (vide par défaut)

### 2. Démarrer l'Application Spring Boot

```bash
cd C:\Users\pc\backend
mvn clean install
mvn spring-boot:run
```

L'API sera disponible sur `http://localhost:8080`

## Structure de l'API REST

### Endpoints Disponibles

#### Courses

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/courses` | Récupérer tous les cours |
| GET | `/api/courses/{id}` | Récupérer un cours par ID |
| POST | `/api/courses` | Créer un nouveau cours |
| PUT | `/api/courses/{id}` | Mettre à jour un cours |
| DELETE | `/api/courses/{id}` | Supprimer un cours |
| GET | `/api/courses/category/{category}` | Récupérer les cours par catégorie |
| GET | `/api/courses/level/{level}` | Récupérer les cours par niveau |
| GET | `/api/courses/instructor/{instructor}` | Récupérer les cours par instructeur |
| GET | `/api/courses/search?title=...` | Rechercher les cours par titre |

## Format de l'Entité Course

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

## Intégration avec Angular

1. Copiez le service `course.service.ts` dans votre projet Angular
2. Importez `HttpClientModule` dans votre `app.module.ts`
3. Injectez `CourseService` dans vos composants
4. Appelez les méthodes du service pour récupérer/modifier les cours

### Exemple d'utilisation dans un composant Angular

```typescript
import { Component, OnInit } from '@angular/core';
import { CourseService, Course } from './services/course.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  courses: Course[] = [];

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des cours:', error);
      }
    });
  }

  createCourse(course: Course): void {
    this.courseService.createCourse(course).subscribe({
      next: (newCourse) => {
        this.courses.push(newCourse);
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
      }
    });
  }

  updateCourse(id: number, course: Course): void {
    this.courseService.updateCourse(id, course).subscribe({
      next: (updatedCourse) => {
        const index = this.courses.findIndex(c => c.id === id);
        if (index > -1) {
          this.courses[index] = updatedCourse;
        }
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
      }
    });
  }

  deleteCourse(id: number): void {
    this.courseService.deleteCourse(id).subscribe({
      next: () => {
        this.courses = this.courses.filter(c => c.id !== id);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
      }
    });
  }

}
```

## Notes Importantes

- Le CORS est configuré pour accepter les requêtes de `http://localhost:4200` (port Angular par défaut)
- La configuration Jackson convertit les noms des champs en snake_case pour la base de données
- Les propriétés nulles ne sont pas incluses dans la réponse JSON
- La base de données créera automatiquement la table `courses` au premier démarrage

## Architecture des Fichiers

```
backend/
├── src/main/java/com/esprit/backend/
│   ├── entity/
│   │   └── Course.java
│   ├── repository/
│   │   └── CourseRepository.java
│   ├── service/
│   │   └── CourseService.java
│   ├── controller/
│   │   └── CourseController.java
│   └── BackendApplication.java
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

## Dépendances Principales

- Spring Boot 4.0.3
- Spring Data JPA
- MySQL Connector
- Lombok
- Jakarta EE (annotations JPA)

## Troubleshooting

### Erreur de connexion à la base de données
- Vérifiez que MySQL est démarré
- Vérifiez que la base de données `courses_db` existe
- Vérifiez les paramètres de connexion dans `application.properties`

### Erreurs CORS
- Vérifiez que le port Angular est 4200
- Vérifiez que la configuration `@CrossOrigin` est présente sur le controller

### Erreurs de sérialisation JSON
- Vérifiez que les noms des propriétés dans l'interface Angular correspondent aux noms en snake_case de la base de données

