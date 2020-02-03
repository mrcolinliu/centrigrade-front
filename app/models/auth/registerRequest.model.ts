export class RegisterRequestModel {
  firstName: string = '';
  secondName: string = '';
  email: string = '';
  password: string = '';
  gender: number = 0; // 0: Prefer not to say
  school: string = '';
  country: number;
  emailPreference: boolean = false;
  url: string = ''; //Return URL for the activation link
}
