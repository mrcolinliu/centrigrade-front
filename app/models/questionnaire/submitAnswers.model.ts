import { Answer } from './answer.model';

export class SubmitAnswersModel {
  constructor(isNext: boolean, answers: Answer[]) {
    this.directionIsNext = isNext;
    this.answers = answers;
  }

  directionIsNext: boolean; //true = Next, false = Previous
  answers: Answer[];
}
