import { ApiReponse } from './../_base/apiResponse.model';

export class CompleteResponse extends ApiReponse {
  firstIncomplete: number; //If there is an incomplete question
}
