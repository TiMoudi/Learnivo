import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Course } from '../models/course.model';
import { CourseApiService } from '../services/course-api.service';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent implements OnInit {
  course: Course | null = null;
  loading = true;
  error = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly courseApiService: CourseApiService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (!Number.isFinite(id)) {
      this.loading = false;
      this.error = 'Invalid course id.';
      return;
    }
    this.loadCourse(id);
  }

  private loadCourse(id: number): void {
    this.loading = true;
    this.error = '';
    this.courseApiService.getCourseById(id).subscribe({
      next: (course) => {
        this.loading = false;
        if (!course) {
          this.error = 'Course not found.';
          return;
        }
        this.course = course;
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load course details.';
      }
    });
  }
}
