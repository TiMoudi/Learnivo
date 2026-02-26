import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, switchMap, take } from 'rxjs';
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
      switchMap((backendCourses) => {
        return this.courseService.getCourses().pipe(
          take(1),
          switchMap((localCourses) => {
            if (localCourses.length === 0) {
              return of(backendCourses);
            }

            const backendKeys = new Set(backendCourses.map((course) => this.getCourseKey(course)));
            const missingLocalCourses = localCourses.filter((course) => !backendKeys.has(this.getCourseKey(course)));

            if (missingLocalCourses.length === 0) {
              return of(this.mergeUniqueCourses(backendCourses, localCourses));
            }

            const createRequests = missingLocalCourses.map(({ id, ...course }) =>
              this.http.post<Course>(this.apiUrl, course).pipe(
                catchError(() => of(null))
              )
            );

            return forkJoin(createRequests).pipe(
              map((createdCourses) => this.mergeUniqueCourses(
                [
                  ...backendCourses,
                  ...createdCourses.filter((course): course is Course => !!course)
                ],
                localCourses
              ))
            );
          })
        );
      }),
      catchError(() => this.courseService.getCourses())
    );
  }

  addCourse(course: Omit<Course, 'id'>): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course).pipe(
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

  private getCourseKey(course: Pick<Course, 'name' | 'instructor' | 'level' | 'category'>): string {
    return [
      course.name,
      course.instructor,
      course.level,
      course.category
    ]
      .map((value) => value?.trim().toLowerCase() ?? '')
      .join('|');
  }

  private mergeUniqueCourses(primary: Course[], secondary: Course[]): Course[] {
    const seen = new Set<string>();
    const merged: Course[] = [];

    for (const course of [...primary, ...secondary]) {
      const key = this.getCourseKey(course);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      merged.push(course);
    }

    return merged;
  }
}
