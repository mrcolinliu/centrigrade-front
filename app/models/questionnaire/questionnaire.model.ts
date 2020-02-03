export class QuestionnaireModel {
  id: number;
  productId: string; //Product ID
  questions: number; //Number of questions in questionnaire
  completed: number; //Number of questions completed
  firstIncomplete: number;
  saveLimit: number;
  status: number;
  pause: number;
}

// Constants for productId:
// WA1 --> Centigrade Web-app
// WA2 --> Centigrade Pro
// WA3 --> Centigrade Classic
