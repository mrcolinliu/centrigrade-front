import { DetailSection } from './detailSection.model';
import { SafeStyle } from '@angular/platform-browser';

export class CourseAreaDetail {
  id: number;
  title: string;
  introText: string;
  match: number;
  matchDesc: string;
  interest: number;
  interestDesc: string;
  sections: DetailSection[] = [];
  image: string;
  safeImage: SafeStyle;
  selected: boolean;
}
