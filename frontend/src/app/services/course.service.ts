import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course } from '../models/course.model';
import { StudentProgress, CourseNotification } from '../models/progress.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses = new BehaviorSubject<Course[]>([
    {
      id: 1,
      name: 'Foundation English',
      level: 'Beginner',
      price: 150,
      duration: '8 weeks',
      description: 'Master the fundamentals of English including grammar, basic vocabulary, and pronunciation. Perfect for complete beginners.',
      instructor: 'Fatema Ben Youssef',
      students_enrolled: 1250,
      rating: 4.8,
      image_url: 'assets/img/portfolio/thumbnails/1.jpg',
      lessons: 32,
      language: 'English',
      certificate: true,
      category: 'Beginner',
      startDate: '2024-03-01'
    },
    {
      id: 2,
      name: 'Conversation Mastery',
      level: 'Intermediate',
      price: 220,
      duration: '10 weeks',
      description: 'Build confidence in speaking English with real-world conversations, listening exercises, and interactive dialogues.',
      instructor: 'Mohamed Ali Hassan',
      students_enrolled: 892,
      rating: 4.9,
      image_url: 'assets/img/portfolio/thumbnails/2.jpg',
      lessons: 40,
      language: 'English',
      certificate: true,
      category: 'Intermediate',
      startDate: '2024-03-10'
    },
    {
      id: 3,
      name: 'Professional Fluency',
      level: 'Advanced',
      price: 280,
      duration: '12 weeks',
      description: 'Achieve advanced English proficiency with complex grammar structures, academic vocabulary, and nuanced communication skills.',
      instructor: 'Dr. Leila Khedher',
      students_enrolled: 654,
      rating: 4.7,
      image_url: 'assets/img/portfolio/thumbnails/3.jpg',
      lessons: 48,
      language: 'English',
      certificate: true,
      category: 'Advanced',
      startDate: '2024-03-15'
    },
    {
      id: 4,
      name: 'Business English',
      level: 'Advanced',
      price: 300,
      duration: '12 weeks',
      description: 'Specialized English for professional environments including business writing, presentations, negotiations, and corporate communication.',
      instructor: 'Samir Bouaziz',
      students_enrolled: 1105,
      rating: 4.9,
      image_url: 'assets/img/portfolio/thumbnails/4.jpg',
      lessons: 45,
      language: 'English',
      certificate: true,
      category: 'Professional',
      startDate: '2024-03-20'
    },
    {
      id: 5,
      name: 'TOEFL Preparation',
      level: 'Advanced',
      price: 350,
      duration: '14 weeks',
      description: 'Comprehensive preparation for the TOEFL iBT exam with practice tests, tips, and strategies to maximize your score.',
      instructor: 'Nadia Maaloul',
      students_enrolled: 2341,
      rating: 4.8,
      image_url: 'assets/img/portfolio/thumbnails/5.jpg',
      lessons: 56,
      language: 'English',
      certificate: true,
      category: 'Certification',
      startDate: '2024-02-25'
    },
    {
      id: 6,
      name: 'IELTS Preparation',
      level: 'Advanced',
      price: 350,
      duration: '14 weeks',
      description: 'Complete IELTS preparation including listening, reading, writing, and speaking with authentic practice materials.',
      instructor: 'Karim Driss',
      students_enrolled: 1876,
      rating: 4.8,
      image_url: 'assets/img/portfolio/thumbnails/6.jpg',
      lessons: 56,
      language: 'English',
      certificate: true,
      category: 'Certification',
      startDate: '2024-02-28'
    },
    {
      id: 7,
      name: 'Cambridge Exam Prep',
      level: 'Intermediate-Advanced',
      price: 320,
      duration: '12 weeks',
      description: 'Prepare for Cambridge English exams (FCE, CAE, CPE) with expert guidance and extensive practice materials.',
      instructor: 'Hana Cherif',
      students_enrolled: 983,
      rating: 4.7,
      image_url: 'assets/img/portfolio/thumbnails/1.jpg',
      lessons: 50,
      language: 'English',
      certificate: true,
      category: 'Certification',
      startDate: '2024-03-05'
    },
    {
      id: 8,
      name: 'Kids English Academy',
      level: 'Beginner',
      price: 120,
      duration: '8 weeks',
      description: 'Fun and engaging English lessons for children with games, songs, and interactive activities to make learning enjoyable.',
      instructor: 'Amira Zahra',
      students_enrolled: 3421,
      rating: 4.9,
      image_url: 'assets/img/portfolio/thumbnails/2.jpg',
      lessons: 32,
      language: 'English',
      certificate: false,
      category: 'Kids',
      startDate: '2024-03-08'
    }
  ]);

  private studentProgress = new BehaviorSubject<StudentProgress[]>([]);
  private notifications = new BehaviorSubject<CourseNotification[]>([]);
  private notificationCounter = 0;

  constructor() { }

  // Get all courses
  getCourses(): Observable<Course[]> {
    return this.courses.asObservable();
  }

  // Get course by ID
  getCourseById(id: number): Observable<Course | undefined> {
    return new Observable(observer => {
      this.courses.subscribe(courses => {
        const course = courses.find(c => c.id === id);
        observer.next(course);
        observer.complete();
      });
    });
  }

  // Add new course
  addCourse(course: Omit<Course, 'id'>): void {
    const courses = this.courses.value;
    const newId = Math.max(...courses.map(c => c.id), 0) + 1;
    const newCourse: Course = { ...course as Course, id: newId };
    this.courses.next([...courses, newCourse]);
  }

  // Update course
  updateCourse(id: number, updatedCourse: Partial<Course>): void {
    const courses = this.courses.value;
    const index = courses.findIndex(c => c.id === id);
    if (index > -1) {
      courses[index] = { ...courses[index], ...updatedCourse };
      this.courses.next([...courses]);
    }
  }

  // Delete course
  deleteCourse(id: number): void {
    const courses = this.courses.value.filter(c => c.id !== id);
    this.courses.next(courses);
  }

  // Search courses
  searchCourses(query: string): Observable<Course[]> {
    return new Observable(observer => {
      this.courses.subscribe(courses => {
        const filtered = courses.filter(c =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase()) ||
          c.level.toLowerCase().includes(query.toLowerCase())
        );
        observer.next(filtered);
        observer.complete();
      });
    });
  }

  // Filter courses by level
  getCoursesByLevel(level: string): Observable<Course[]> {
    return new Observable(observer => {
      this.courses.subscribe(courses => {
        const filtered = courses.filter(c => c.level.toLowerCase().includes(level.toLowerCase()));
        observer.next(filtered);
        observer.complete();
      });
    });
  }

  // Filter courses by category
  getCoursesByCategory(category: string): Observable<Course[]> {
    return new Observable(observer => {
      this.courses.subscribe(courses => {
        const filtered = courses.filter(c => c.category === category);
        observer.next(filtered);
        observer.complete();
      });
    });
  }

  // ============ PROGRESS TRACKING ============
  // Get student progress for a specific course
  getStudentProgress(studentId: string, courseId: number): Observable<StudentProgress | undefined> {
    return new Observable(observer => {
      this.studentProgress.subscribe(progresses => {
        const progress = progresses.find(p => p.studentId === studentId && p.courseId === courseId);
        observer.next(progress);
        observer.complete();
      });
    });
  }

  // Get all progress for a student
  getAllStudentProgress(studentId: string): Observable<StudentProgress[]> {
    return new Observable(observer => {
      this.studentProgress.subscribe(progresses => {
        const studentProgresses = progresses.filter(p => p.studentId === studentId);
        observer.next(studentProgresses);
        observer.complete();
      });
    });
  }

  // Update student progress
  updateStudentProgress(studentId: string, courseId: number, completedModules: number, totalModules: number): void {
    const progresses = this.studentProgress.value;
    const existingIndex = progresses.findIndex(p => p.studentId === studentId && p.courseId === courseId);
    
    const course = this.courses.value.find(c => c.id === courseId);
    const completionPercentage = Math.round((completedModules / totalModules) * 100);
    const status = completionPercentage === 100 ? 'Completed' : completedModules > 0 ? 'In Progress' : 'Not Started';

    const progress: StudentProgress = {
      studentId,
      courseId,
      courseName: course?.name || '',
      completedModules,
      totalModules,
      completionPercentage,
      lastAccessed: new Date().toISOString(),
      status
    };

    if (existingIndex > -1) {
      progresses[existingIndex] = progress;
    } else {
      progresses.push(progress);
    }

    this.studentProgress.next([...progresses]);
  }

  // ============ NOTIFICATIONS ============
  // Get all unread notifications
  getNotifications(): Observable<CourseNotification[]> {
    return this.notifications.asObservable();
  }

  // Add new course notification
  notifyNewCourse(courseName: string, courseId: number): void {
    const notifications = this.notifications.value;
    const notification: CourseNotification = {
      id: this.notificationCounter++,
      courseId,
      courseName,
      message: `New course available: ${courseName}`,
      type: 'new',
      createdAt: new Date().toISOString(),
      read: false
    };
    notifications.unshift(notification); // Add to beginning
    this.notifications.next([...notifications]);
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: number): void {
    const notifications = this.notifications.value;
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifications.next([...notifications]);
    }
  }

  // Get unread notification count
  getUnreadNotificationCount(): number {
    return this.notifications.value.filter(n => !n.read).length;
  }

  // Clear all notifications
  clearNotifications(): void {
    this.notifications.next([]);
  }
}
