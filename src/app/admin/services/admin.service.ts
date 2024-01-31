import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

import { QuizResponse } from 'src/app/quiz/interfaces/quizResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  public constructor(private readonly http: HttpClient) {}

  public getQuizResponses(): Observable<QuizResponse[]> {
    const url = `${environment.apiUrl}/responses`;
    return this.http.get<QuizResponse[]>(url);
  }

  public getSingleResponse(id: string): Observable<QuizResponse> {
    const url = `${environment.apiUrl}/response?id=${id}`;
    return this.http.get<QuizResponse>(url);
  }
}
