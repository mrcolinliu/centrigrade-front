import { FilterOption } from './filterOption.model';

export class CourseFilter {
  id: number;
  title: string;
  type: string;
  tag: string;
  completed: boolean;
  isRequired: boolean;
  options: FilterOption[];

  selectedCount: number; //Not from API
}

// Constants for type:
// FTYPE_BUDGET --> The course cost
// FTYPE_LOCATION --> The locations a user wishes to study at
// FTYPE_TARIFF --> The user's current predicted grades
// FTYPE_LANGUAGES --> Specified taught languages
// FTYPE_JOINT_COURSES --> Does the user want to see joint courses
// FTYPE_LENGTH --> The course length
// FTYPE_OTHER --> A dynamic filter

// Secondary filter types:
// FTYPE_RANGE – render as two incrementing fields, expects two selected: [id, value [label, type (in the case of currency would be currency symbol), value], selected]
// FTYPE_SINGLESELECT – render list, expects one option selected [id, value, selected]
// FTYPE_MULTISELECT – render list, expects one or more options selected [id, value, selected]
// FTYPE_BOOLEAN – render toggle switch, expects one option selected [id, value, selected]
