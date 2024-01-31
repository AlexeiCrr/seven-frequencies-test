import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, delay, of } from 'rxjs';

import { Question } from '../interfaces/question';
import {
  CreateQuizResponseParams,
  QuizResponseCreate,
} from '../interfaces/quizResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  public constructor(private readonly http: HttpClient) {}

  public getQuestions(): Observable<Question[]> {
    const url = `${environment.apiUrl}/questions`;
    return this.http.get<Question[]>(url);
  }

  public createQuizResponse(
    params: CreateQuizResponseParams
  ): Observable<QuizResponseCreate> {
    const url = `${environment.apiUrl}/response`;
    const body = { ...params };
    return this.http.post<QuizResponseCreate>(url, body);
  }
}
