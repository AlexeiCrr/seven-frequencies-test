import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { QuizResponse, UserData } from 'src/app/quiz/interfaces/quizResponse';
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

	public modifyResponse(data: UserData): Observable<QuizResponse> {
		const url = `${environment.apiUrl}/response`;
		return this.http.put<QuizResponse>(url, data);
	}

	public addLicenseCodes(amount: number): Observable<Blob> {
		const url = `${environment.apiUrl}/codes`;
		return this.http.patch(url, { amount }, { responseType: 'blob' });
	}
}
