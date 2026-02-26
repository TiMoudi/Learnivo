import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { CourseApiService } from '../services/course-api.service';
import { ExportService } from '../services/export.service';
import { ImageImportService, ImportedImage } from '../services/image-import.service';
import { Course } from '../models/course.model';
import { StudentProgress, CourseNotification } from '../models/progress.model';

@Component({
    selector: 'app-courses',
    imports: [CommonModule, FormsModule],
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  isAdmin = localStorage.getItem('role') === 'admin';
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  phoneCountry = 'TN'; // Default to Tunisia
  studentId = this.getOrCreateStudentId();
  
  studentProgress: StudentProgress[] = [];
  notifications: CourseNotification[] = [];
  unreadNotificationCount = 0;
  showNotifications = false;

  // Export/Import properties
  importedImages: ImportedImage[] = [];
  showImportPanel = false;
  importMessage = '';
  selectedCourseForExport: number | null = null;
  selectedRatings: Record<number, number> = {};
  searchTerm = '';
  sortCriteria: 'name' | 'rating' | 'students_enrolled' | 'category' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  onSelectCourseForExport(event: any) {
    const v = event.target && event.target.value;
    this.selectedCourseForExport = v ? Number(v) : null;
  }
  
  formData = {
    fullName: '',
    email: '',
    phone: '',
    level: '',
    course: '',
    message: ''
  };

  countryPhoneCodes = {
    'TN': '+216',
    'FR': '+33',
    'US': '+1',
    'GB': '+44',
    'DE': '+49'
  };

  constructor(
    private router: Router,
    private courseService: CourseService,
    private courseApiService: CourseApiService,
    private exportService: ExportService,
    private imageImportService: ImageImportService
  ) {}

  private getOrCreateStudentId(): string {
    const existingId = localStorage.getItem('student_id');
    if (existingId) {
      return existingId;
    }

    const generatedId = `student_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    localStorage.setItem('student_id', generatedId);
    return generatedId;
  }

  ngOnInit() {
    this.loadCourses();
    this.loadNotifications();
    this.loadStudentProgress();
  }

  loadCourses() {
    this.courseApiService.getCourses().subscribe(
      (courses: Course[]) => {
        this.courses = courses;
        this.selectedRatings = courses.reduce((acc, course) => {
          acc[course.id] = 5;
          return acc;
        }, {} as Record<number, number>);
        this.applyFilters();
      }
    );
  }

  applyFilters() {
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
  }

  private getSortableValue(
    course: Course,
    criteria: 'name' | 'rating' | 'students_enrolled' | 'category'
  ): string | number {
    return course[criteria] ?? '';
  }

  loadNotifications() {
    this.courseService.getNotifications().subscribe(
      (notifications: CourseNotification[]) => {
        this.notifications = notifications;
        this.unreadNotificationCount = this.courseService.getUnreadNotificationCount();
      }
    );
  }

  loadStudentProgress() {
    this.courseService.getAllStudentProgress(this.studentId).subscribe(
      (progress: StudentProgress[]) => {
        this.studentProgress = progress;
      }
    );
  }

  selectCourse(courseId: number) {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      this.formData.course = course.name;
      this.router.navigate(['/courses', courseId]);
    }
  }

  validatePhoneNumber(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (this.phoneCountry === 'TN') {
      return cleanPhone.length === 8 || /^21698\d{6}$|^216(2|3|4|5|7|9)\d{7}$/.test(cleanPhone);
    }
    return cleanPhone.length >= 7;
  }

  submitEnrollment() {
    if (!this.validatePhoneNumber(this.formData.phone)) {
      alert('Please enter a valid phone number for ' + this.phoneCountry);
      return;
    }

    if (this.formData.fullName && this.formData.email && this.formData.phone && this.formData.level && this.formData.course) {
      console.log('Enrollment Data:', this.formData);
      alert(`Thank you ${this.formData.fullName}! We have received your enrollment for ${this.formData.course}. We will contact you soon.`);
      this.resetForm();
    } else {
      alert('Please fill in all required fields.');
    }
  }

  updateProgress(courseId: number, completedModules: number) {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      this.courseService.updateStudentProgress(this.studentId, courseId, completedModules, course.lessons);
      this.loadStudentProgress();
    }
  }

  submitRating(courseId: number) {
    const ratingValue = this.selectedRatings[courseId];
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      alert('Please choose a rating between 1 and 5.');
      return;
    }

    this.courseApiService.rateCourse(courseId, this.studentId, ratingValue).subscribe({
      next: () => {
        this.loadCourses();
      },
      error: () => {
        alert('Unable to submit rating. Please try again.');
      }
    });
  }

  getProgressForCourse(courseId: number): StudentProgress | undefined {
    return this.studentProgress.find(p => p.courseId === courseId);
  }

  markNotificationAsRead(notificationId: number) {
    this.courseService.markNotificationAsRead(notificationId);
    this.loadNotifications();
  }

  resetForm() {
    this.formData = { fullName: '', email: '', phone: '', level: '', course: '', message: '' };
  }

  formatPhoneInput() {
    const countryCode = this.countryPhoneCodes[this.phoneCountry as keyof typeof this.countryPhoneCodes];
    if (countryCode) {
      let cleanPhone = this.formData.phone.replace(/^\+\d+\s*/, '').trim();
      if (!this.formData.phone.startsWith('+')) {
        this.formData.phone = countryCode + ' ' + cleanPhone;
      }
    }
  }

  // ========== EXPORT FUNCTIONALITY ==========
  /**
   * Export all courses to PDF
   */
  exportAllCoursesToPDF() {
    console.log('Export all courses clicked');
    if (this.courses.length === 0) {
      alert('No courses to export');
      return;
    }
    try {
      this.exportService.exportCoursesToPDF(this.courses, `courses_${new Date().getTime()}.pdf`);
      alert('Course catalog exported successfully!');
    } catch {
      alert('PDF export failed. Please check browser download permissions and try again.');
    }
  }

  /**
   * Export single course to PDF
   */
  exportCourseToPDF(courseId: number) {
    if (!courseId) {
      alert('Please select a course first.');
      return;
    }

    console.log('Export selected course clicked', courseId);
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      try {
        this.exportService.exportCourseToPDF(course);
        alert(`Course "${course.name}" exported successfully!`);
      } catch {
        alert('PDF export failed for this course. Please try again.');
      }
    } else {
      alert('Selected course was not found.');
    }
  }

  // ========== IMPORT FUNCTIONALITY ==========
  /**
   * Handle image file input change
   */
  onImageSelected(event: any) {
    const files: FileList = event.target.files;
    
    if (files.length === 0) {
      return;
    }

    this.importImages(files);
  }

  /**
   * Import images from file input
   */
  async importImages(files: FileList) {
    try {
      const importedImages = await this.imageImportService.importImages(files);
      this.importedImages = this.imageImportService.getImportedImages();
      this.importMessage = `Successfully imported ${importedImages.length} image(s)`;
      
      setTimeout(() => {
        this.importMessage = '';
      }, 3000);
    } catch (error) {
      this.importMessage = `Error importing images: ${error}`;
      alert(`Error: ${error}`);
    }
  }

  /**
   * Remove imported image
   */
  removeImportedImage(imageName: string) {
    this.imageImportService.removeImage(imageName);
    this.importedImages = this.imageImportService.getImportedImages();
  }

  /**
   * Download imported image
   */
  downloadImportedImage(imageName: string) {
    this.imageImportService.downloadImage(imageName);
  }

  /**
   * Clear all imported images
   */
  clearAllImages() {
    if (confirm('Are you sure you want to clear all imported images?')) {
      this.imageImportService.clearImages();
      this.importedImages = [];
    }
  }

  /**
   * Get image statistics
   */
  getImageStats() {
    return this.imageImportService.getImageStats();
  }

  /**
   * Use imported image for course (set as thumbnail)
   */
  useImageForCourse(courseId: number, imageName: string) {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      const imageDataUrl = this.imageImportService.getImageDataUrl(imageName);
      if (imageDataUrl) {
        // Update course image_url (in real app, this would be sent to backend)
        this.courseService.updateCourse(courseId, { image_url: imageDataUrl });
        this.loadCourses();
        alert(`Image set for course "${course.name}"`);
      }
    }
  }

}
