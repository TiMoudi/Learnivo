export interface Course {
  id: number;
  name: string;
  level: string;
  duration: string;
  description: string;
  instructor: string;
  students_enrolled: number;
  rating: number;
  image_url: string;
  pdf_url?: string;
  lessons: number;
  language: string;
  certificate: boolean;
  startDate?: string;
  category: string;
}
