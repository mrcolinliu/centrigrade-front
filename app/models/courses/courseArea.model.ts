export class CourseAreasResponse {
  maxCourseAreas: number;
  courseAreas: CourseArea[] = [];
}

export class CourseArea {
  id: number;
  title: string;
  match: number;
  matchDesc: number;
  interest: number;
  interestDesc: number;
  selected: boolean;
  highlighted: boolean;
  ordinal: number;
}

export class CourseAreaSummary {
  courseAreaName: string;
  interest: number;
  interestDesc: string;
  match: number;
  matchDesc: string;
}

export class CourseAreaTop {
  count: number;
  courseAreas: CourseAreaTopItem[];
}

export class CourseAreaTopItem {
  title: string;
  ordinal: number;
}
