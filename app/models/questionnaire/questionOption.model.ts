export class QuestionOption {
  id: number;
  title: string;
  children: QuestionOption[] = [];
  parent: number; //nullable
  selected: boolean;
  freeTextField: boolean; //Should have a free text field
  freeTextResponse: string = '';
  notApplicableField: boolean; //Should have a 'none of the below' type response
}
