import { Answer } from './answer';
import { GreetingFormData } from './greeting';

export interface QuizResponseCreate {
  id: string;
  userData: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdOn: string;
  frequencies: Frequency[];
}
export interface QuizResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdOn: string;
  answers: Answer[];
  frequencies: {
    [key: string]: number;
  };
}

export interface Frequency {
  name: string;
  value: number;
  description: string;
}

export interface CreateQuizResponseParams {
  userData: GreetingFormData;
  answers: Answer[];
}
