export interface StudentProgress {
  studentId: string;
  courseId: number;
  courseName: string;
  completedModules: number;
  totalModules: number;
  completionPercentage: number;
  lastAccessed: string;
  status: 'In Progress' | 'Completed' | 'Not Started';
}

export interface CourseNotification {
  id: number;
  courseId: number;
  courseName: string;
  message: string;
  type: 'new' | 'update' | 'reminder';
  createdAt: string;
  read: boolean;
}
