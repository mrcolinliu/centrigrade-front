import { CourseAreaSummary } from './courseArea.model';
import { DetailSection } from './detailSection.model';
import { InstitutionSummary } from './institutionSummary.model';
import { ResearchArea } from '../research/research.models';

export class CourseDetail {
  courseId: string;
  shortlisted: boolean;
  title: string;
  website: string;
  institution: InstitutionSummary = new InstitutionSummary();
  code: string;
  courseAreas: CourseAreaSummary[] = [];
  section: DetailSection[] = [];
  userRating: number;
  researchAreas: ResearchArea[] = [];
  note: string;
  image: string;
}
