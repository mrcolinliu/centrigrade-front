import { ApiReponse } from 'app/models/_base/apiResponse.model';

export class FaqItem {
  question: string;
  answer: string;
}

export class FaqResult extends ApiReponse {
  items: FaqItem[];
}
