import { ApiReponse } from './../_base/apiResponse.model';
import { AppConfig } from '../../app.config';
import { EndpointModel } from './endpoint.model';

export class LoginResponseModel extends ApiReponse {
  token: string = null;
  incomplete: boolean = false;
  questionnaireId: string;
  userId: number;
  displayLanguage: string = AppConfig.defaultLocale;
  endpoints: EndpointModel[] = [];
}
