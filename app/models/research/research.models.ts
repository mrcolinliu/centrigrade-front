import { FormControl } from '@angular/forms';
import { DetailSection } from '../courses/detailSection.model';
import { SafeStyle } from '@angular/platform-browser';

export type ResearchAreaType = 'course' | 'institution';

export class ResearchArea {
  areaId: number;
  areaHeader: string;
  userText: string;
  userRating: number;

  //not API
  noteOpen: boolean;
  noteControl: FormControl = new FormControl();
  noteStatus: string = '';
  noteIsSaving: boolean;
}

export class UpdateResearchAreaLink {
  aid: number;
  linkId: string;
  areaRating: number;
  text: string;
}

export class ResearchAreasResponse {
  count: number;
  researchArea: ResearchAreaSummary[] = [];
}

export class ResearchAreaSummary {
  id: number;
  text: string;
  type: ResearchAreaType;
}

export class ShortlistCourseSummary {
  courseId: string;
  title: string;
  subtitle: string; // Maybe no longer in use can remove
  details: string;
  institution: string;
  userRating: number;
  courseRating: number;
  active: boolean;
  rank: string;
  studentSatisfaction: string;
  employability: string;
  logo: string;
  image: string;
  safeImage: SafeStyle;

  //Not API
  institutionSummary: ShortlistInstitutionSummary;
  selected: boolean;
}

export class ShortlistInstitutionSummary {
  institutionId: string;
  name: string;
  address: string;
  logo: string; //url
}

export class ShortlistResponse {
  countCourses: number;
  countInstitutions: number;
  courses: ShortlistCourseSummary[] = [];
  institutions: ShortlistInstitutionSummary[] = [];
}

export class CourseComparisonDetails {
  courseId: string;
  title: string;
  institution: string;
  logo: string;
  rating: number;
  rank: string;
  studentSatisfaction: string;
  employability: string;
  safeImage: SafeStyle;
  information: CourseInformation[] = [];
  researchAreas: ResearchArea[] = [];
}

export class ComparePullDown {
  selected: string;
}

class CourseInformation {
  header: string;
  text: string;
}

class Note {
  institutionId: string;
  institution: string;
  note: string;
}

export class FinalisedShortlist {
  countCourses: number;
  courses: FinalisedShortlistCourse[] = [];
}

export class FinalisedShortlistCourse {
  courseId: string;
  title: string;
  institution: string;
  type: string;
  overview: string;
  rating: number;
  researchAreas: FinalisedShortlistResearchArea[] = [];

  isExpanded: boolean = false;
}

class FinalisedShortlistResearchArea {
  areaId: number;
  areaHeader: string;
  userText: string;
  userRating: number;
}

export class ResearchSummary {
  courses: ResearchCourse[];
}

export class ResearchCourse {
  ambition: CourseAmbition;
  courseId: string;
  institution: CourseInstitution;
  note: string;
  researchAreas: ResearchArea[];
  section: DetailSection[];
  shortlisted: boolean;
  title: string;
  subtitle: string;
  userRating: number;
  isCollapsed: boolean = true;
}

export class CourseAmbition {
  value: number;
  outOf: number;
}

export class CourseInstitution {
  institutionId: string;
  institutionLogo: string;
  institutionName: string;
  researchAreas: ResearchArea[];
}
