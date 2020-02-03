import { SafeStyle } from '@angular/platform-browser';

export class Course {
  id: string;
  courseName: string;
  subtitle: string;
  institutionName: string;
  location: string;
  award: string;
  shortlisted: boolean;
  viewed: boolean;
  detail: string;
  ambition: CourseAmbition;
  orderRank: number;
  studentSatisfaction: string;
  employability: string;
  logo: string;
  image: string;
  safeImage: SafeStyle;
}

export class CourseAmbition {
  value: number;
  outOf: number;
}
