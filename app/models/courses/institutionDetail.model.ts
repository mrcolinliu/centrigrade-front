import { DetailSection } from './detailSection.model';
export class InstitutionDetail {
  institutionId: string;
  name: string;
  website: string;
  image: string;
  logo: string;
  researchAreas: any[] = [];
  note: string;
  section: DetailSection[] = [];
}
