// course.service.ts - Service Angular pour consommer l'API Spring Boot

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Course {
  id: number;
  name: string;
  level: string;
  price: number;
  duration: string;
  description: string;
  instructor: string;
  students_enrolled: number;
  rating: number;
  image_url: string;
  lessons: number;
  language: string;
  certificate: boolean;
  startDate?: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = 'http://localhost:8080/api/courses';

  constructor(private http: HttpClient) { }

  // Récupérer tous les cours
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  // Récupérer un cours par ID
  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouveau cours
  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  // Mettre à jour un cours
  updateCourse(id: number, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course);
  }

  // Supprimer un cours
  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les cours par catégorie
  getCoursesByCategory(category: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/category/${category}`);
  }

  // Récupérer les cours par niveau
  getCoursesByLevel(level: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/level/${level}`);
  }

  // Récupérer les cours par instructeur
  getCoursesByInstructor(instructor: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/instructor/${instructor}`);
  }

  // Rechercher les cours par nom/titre
  searchCourses(searchTerm: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/search`, {
      params: { title: searchTerm }
    });
  }
}

