export class ApiReponse {
  success: boolean;
  returnCode: ApiReturnCode = new ApiReturnCode();
}

export class ApiReturnCode {
  errorCode: string = null;
  label: string = null;
  message: string = null;
  type: string = null;
  errors: string | string[] = [];
}
