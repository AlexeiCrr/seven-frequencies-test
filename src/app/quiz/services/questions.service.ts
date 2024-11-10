import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Question } from '../interfaces/question';
import { CreateQuizResponseParams, QuizResponseCreate } from '../interfaces/quizResponse';

@Injectable({
	providedIn: 'root',
})
export class QuestionsService {
	public constructor(private readonly http: HttpClient) {}

	public getQuestions(): Observable<Question[]> {
		const url = `${environment.apiUrl}/questions`;
		return this.http.get<Question[]>(url);
	}

	public createQuizResponse(params: CreateQuizResponseParams): Observable<QuizResponseCreate> {
		const url = `${environment.apiUrl}/response`;

		const body = { ...params };
		console.log('BODY', body);
		return this.http.post<QuizResponseCreate>(url, body);
	}
}
