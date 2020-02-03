import { QuestionOption } from './questionOption.model';

export class Question {
  questionId: number;
  questionNumber: number;
  header: string;
  type: string;
  question: string;
  responseType: string;
  responseMin: number;
  responseMax: number;
  staticText: string;
  answered: boolean;
  options: QuestionOption[];
}

// Constants for type:
// QTYPE_SINGLE --> A regular multiple choice question – single response
// QTYPE_MULTI --> A multi-layer question –multiple first layer responses, single second level responses
// QTYPE_LIST --> A list of options, each potentially including a further list of options
// QTYPE_FREE_TEXT --> User can enter a free text response
// QTYPE_STATEMENT --> Static text on a question page

// Constants for responseType
// RESPONSE_REQUIRED_NOW --> the question cannot be skipped
// RESPONSE_REQUIRED_EVENTUALLY --> the question is mandatory to submission i.e. UI would flag up these questions at the end but allow users to skip them in the process of completion
// RESPONSE_NOT_REQUIRED --> the question can be skipped completely
