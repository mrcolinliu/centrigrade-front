import { ApiReponse } from '../_base/apiResponse.model';

export class QuestionStatusModel extends ApiReponse {
  status: number;
  pause: number;
}

// Values for status:
// unstarted => 0
// started => 50
// complete => 100
// results created => 200
