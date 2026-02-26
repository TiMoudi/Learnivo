import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap, take } from 'rxjs';
import { Course } from '../models/course.model';
import { CourseService } from './course.service';

@Injectable({
  providedIn: 'root'
})
export class CourseApiService {
  private readonly apiUrl = '/api/courses';

  constructor(
    private readonly http: HttpClient,
    private readonly courseService: CourseService
  ) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl).pipe(
      catchError(() => this.courseService.getCourses().pipe(take(1)))
    );
  }

  addCourse(course: Omit<Course, 'id'>, pdfFile?: File): Observable<Course> {
    const formData = new FormData();
    formData.append('course', JSON.stringify(course));
    if (pdfFile) {
      formData.append('pdfFile', pdfFile);
    }

    return this.http.post<Course>(this.apiUrl, formData).pipe(
      catchError(() => {
        this.courseService.addCourse(course);
        return this.courseService.getCourses().pipe(
          take(1),
          map((courses) => courses[courses.length - 1])
        );
      })
    );
  }

  updateCourse(id: number, payload: Partial<Course>): Observable<Course | undefined> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, payload).pipe(
      map((course) => course),
      catchError(() => {
        this.courseService.updateCourse(id, payload);
        return this.courseService.getCourseById(id).pipe(take(1));
      })
    );
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        this.courseService.deleteCourse(id);
        return of(void 0);
      })
    );
  }

  rateCourse(id: number, studentId: string, rating: number): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/${id}/ratings`, { studentId, rating });
  }
}
