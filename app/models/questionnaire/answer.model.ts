export class Answer {
  id: number; //id of the option chosen
  selected: boolean; //if the option is selected
  freeTextResponse: string;
  parent: number;
  children: Answer[];
}
