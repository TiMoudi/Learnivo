
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Course } from '../models/course.model';
import { CourseApiService } from '../services/course-api.service';

interface CategoryStat {
  name: string;
  count: number;
  students: number;
  percentage: number;
  color: string;
}

interface CourseForm {
  name: string;
  level: string;
  duration: string;
  description: string;
  instructor: string;
  lessons: number;
  category: string;
  image_url: string;
  pdf_url: string;
}

@Component({
    selector: 'app-dashboard',
    imports: [FormsModule, RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  categoryStats: CategoryStat[] = [];

  totalCourses = 0;
  totalStudents = 0;
  averageRating = 0;
  pieGradient = 'conic-gradient(#2D5757 0deg 360deg)';

  showAddForm = false;
  showEditForm = false;
  editingCourseId: number | null = null;

  newCourseForm: CourseForm = {
    name: '',
    level: 'Beginner',
    duration: '',
    description: '',
    instructor: '',
    lessons: 0,
    category: 'Beginner',
    image_url: '',
    pdf_url: ''
  };
  newCourseSubmitted = false;
  newCourseErrors: Partial<Record<keyof CourseForm, string>> = {};
  selectedNewCoursePdfFile: File | null = null;

  editCourseForm: CourseForm & { id: number } = {
    id: 0,
    name: '',
    level: 'Beginner',
    duration: '',
    description: '',
    instructor: '',
    lessons: 0,
    category: 'Beginner',
    image_url: '',
    pdf_url: ''
  };
  searchTerm = '';
  sortCriteria: 'name' | 'rating' | 'students_enrolled' | 'category' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  private readonly categoryColors = ['#2D5757', '#E76F51', '#2A9D8F', '#E9C46A', '#F4A261', '#457B9D', '#8AB17D', '#D62828'];

  constructor(private readonly courseApiService: CourseApiService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  trackByCategory(_: number, stat: CategoryStat): string {
    return stat.name;
  }

  loadCourses(): void {
    this.courseApiService.getCourses().subscribe((courses) => {
      this.courses = courses;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const query = this.searchTerm.trim().toLowerCase();
    const filtered = this.courses.filter((course) => {
      if (!query) {
        return true;
      }
      const searchableValue = [
        course.name,
        course.category,
        course.instructor,
        course.level,
        course.duration
      ]
        .join(' ')
        .toLowerCase();
      return searchableValue.includes(query);
    });

    filtered.sort((a, b) => {
      const aValue = this.getSortableValue(a, this.sortCriteria);
      const bValue = this.getSortableValue(b, this.sortCriteria);
      const result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return this.sortDirection === 'asc' ? result : -result;
    });

    this.filteredCourses = filtered;
    this.buildStatistics(this.filteredCourses);
  }

  addCourse(): void {
    this.newCourseSubmitted = true;
    if (!this.validateNewCourseForm()) {
      return;
    }

    const payload: Omit<Course, 'id'> = {
      name: this.newCourseForm.name,
      level: this.newCourseForm.level,
      duration: this.newCourseForm.duration,
      description: this.newCourseForm.description,
      instructor: this.newCourseForm.instructor,
      students_enrolled: 0,
      rating: 0,
      image_url: this.newCourseForm.image_url || 'assets/img/portfolio/thumbnails/1.jpg',
      lessons: this.newCourseForm.lessons,
      language: 'English',
      certificate: true,
      category: this.newCourseForm.category,
      pdf_url: '',
      startDate: new Date().toISOString().split('T')[0]
    };

    this.courseApiService.addCourse(payload, this.selectedNewCoursePdfFile ?? undefined).subscribe(() => {
      this.resetNewCourseForm();
      this.showAddForm = false;
      this.loadCourses();
    });
  }

  startEditCourse(course: Course): void {
    this.editingCourseId = course.id;
    this.editCourseForm = {
      id: course.id,
      name: course.name,
      level: course.level,
      duration: course.duration,
      description: course.description,
      instructor: course.instructor,
      lessons: course.lessons,
      category: course.category,
      image_url: course.image_url,
      pdf_url: course.pdf_url || ''
    };
    this.showEditForm = true;
    this.showAddForm = false;
  }

  saveEditCourse(): void {
    if (!this.editingCourseId) {
      return;
    }

    if (!this.editCourseForm.name || !this.editCourseForm.instructor) {
      alert('Please fill in Name and Instructor.');
      return;
    }

    const payload: Partial<Course> = {
      name: this.editCourseForm.name,
      level: this.editCourseForm.level,
      duration: this.editCourseForm.duration,
      description: this.editCourseForm.description,
      instructor: this.editCourseForm.instructor,
      lessons: this.editCourseForm.lessons,
      category: this.editCourseForm.category,
      image_url: this.editCourseForm.image_url,
      pdf_url: this.editCourseForm.pdf_url
    };

    this.courseApiService.updateCourse(this.editingCourseId, payload).subscribe(() => {
      this.showEditForm = false;
      this.editingCourseId = null;
      this.loadCourses();
    });
  }

  deleteCourse(course: Course): void {
    if (!confirm(`Delete course "${course.name}"?`)) {
      return;
    }

    this.courseApiService.deleteCourse(course.id).subscribe({
      next: () => {
        this.loadCourses();
      },
      error: () => {
        alert('Unable to delete course. Please try again.');
      }
    });
  }

  resetNewCourseForm(): void {
    this.newCourseForm = {
      name: '',
      level: 'Beginner',
      duration: '',
      description: '',
      instructor: '',
      lessons: 0,
      category: 'Beginner',
      image_url: '',
      pdf_url: ''
    };
    this.selectedNewCoursePdfFile = null;
    this.newCourseSubmitted = false;
    this.newCourseErrors = {};
  }

  onNewCourseFieldChange(): void {
    if (this.newCourseSubmitted) {
      this.validateNewCourseForm();
    }
  }

  onNewCourseImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.newCourseErrors.image_url = 'Please choose a valid image file.';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.newCourseForm.image_url = String(reader.result ?? '');
      this.onNewCourseFieldChange();
    };
    reader.readAsDataURL(file);
  }

  onNewCoursePdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      this.newCourseErrors.pdf_url = 'Please choose a valid PDF file.';
      return;
    }

    this.selectedNewCoursePdfFile = file;
    this.newCourseForm.pdf_url = file.name;
    this.newCourseErrors.pdf_url = '';
    this.onNewCourseFieldChange();
  }

  cancelAddCourse(): void {
    this.showAddForm = false;
    this.resetNewCourseForm();
  }

  private validateNewCourseForm(): boolean {
    this.newCourseForm = {
      ...this.newCourseForm,
      name: this.newCourseForm.name.trim(),
      instructor: this.newCourseForm.instructor.trim(),
      duration: this.newCourseForm.duration.trim(),
      description: this.newCourseForm.description.trim(),
      image_url: this.newCourseForm.image_url.trim(),
      pdf_url: this.newCourseForm.pdf_url.trim()
    };

    const errors: Partial<Record<keyof CourseForm, string>> = {};

    if (!this.newCourseForm.name) {
      errors.name = 'Course name is required.';
    } else if (this.newCourseForm.name.length < 3) {
      errors.name = 'Course name must contain at least 3 characters.';
    } else if (this.newCourseForm.name.length > 100) {
      errors.name = 'Course name must not exceed 100 characters.';
    }

    if (!this.newCourseForm.instructor) {
      errors.instructor = 'Instructor name is required.';
    } else if (this.newCourseForm.instructor.length < 3) {
      errors.instructor = 'Instructor name must contain at least 3 characters.';
    } else if (this.newCourseForm.instructor.length > 80) {
      errors.instructor = 'Instructor name must not exceed 80 characters.';
    }

    if (!this.newCourseForm.duration) {
      errors.duration = 'Duration is required.';
    } else if (this.newCourseForm.duration.length < 2) {
      errors.duration = 'Duration value is too short.';
    } else if (this.newCourseForm.duration.length > 40) {
      errors.duration = 'Duration must not exceed 40 characters.';
    }

    if (!Number.isInteger(this.newCourseForm.lessons) || this.newCourseForm.lessons <= 0) {
      errors.lessons = 'Lessons must be a positive integer.';
    } else if (this.newCourseForm.lessons > 500) {
      errors.lessons = 'Lessons must be less than or equal to 500.';
    }

    if (this.newCourseForm.description.length > 500) {
      errors.description = 'Description must not exceed 500 characters.';
    }

    if (this.newCourseForm.image_url && !this.isValidImageValue(this.newCourseForm.image_url)) {
      errors.image_url = 'Image must be a valid URL or uploaded image file.';
    }
    if (this.newCourseForm.pdf_url && !this.selectedNewCoursePdfFile) {
      errors.pdf_url = 'Please upload a PDF file.';
    }

    this.newCourseErrors = errors;
    return Object.keys(errors).length === 0;
  }

  private isValidImageValue(value: string): boolean {
    if (value.startsWith('data:image/')) {
      return true;
    }

    return /^(https?:\/\/|assets\/).+/i.test(value);
  }

  private getSortableValue(
    course: Course,
    criteria: 'name' | 'rating' | 'students_enrolled' | 'category'
  ): string | number {
    return course[criteria] ?? '';
  }

  private buildStatistics(courses: Course[]): void {
    this.totalCourses = courses.length;
    this.totalStudents = courses.reduce((sum, course) => sum + (course.students_enrolled || 0), 0);
    this.averageRating = this.totalCourses
      ? Number((courses.reduce((sum, course) => sum + (course.rating || 0), 0) / this.totalCourses).toFixed(1))
      : 0;

    const counts = new Map<string, { count: number; students: number }>();

    for (const course of courses) {
      const key = course.category || 'Uncategorized';
      const current = counts.get(key) ?? { count: 0, students: 0 };
      counts.set(key, {
        count: current.count + 1,
        students: current.students + (course.students_enrolled || 0)
      });
    }

    this.categoryStats = Array.from(counts.entries())
      .map(([name, value], index) => ({
        name,
        count: value.count,
        students: value.students,
        percentage: this.totalCourses ? Number(((value.count / this.totalCourses) * 100).toFixed(1)) : 0,
        color: this.categoryColors[index % this.categoryColors.length]
      }))
      .sort((a, b) => b.count - a.count);

    this.pieGradient = this.createPieGradient(this.categoryStats);
  }

  private createPieGradient(stats: CategoryStat[]): string {
    if (!stats.length) {
      return 'conic-gradient(#2D5757 0deg 360deg)';
    }

    let currentDegree = 0;
    const segments: string[] = [];

    for (const stat of stats) {
      const span = (stat.percentage / 100) * 360;
      const endDegree = currentDegree + span;
      segments.push(`${stat.color} ${currentDegree}deg ${endDegree}deg`);
      currentDegree = endDegree;
    }

    return `conic-gradient(${segments.join(', ')})`;
  }
}
