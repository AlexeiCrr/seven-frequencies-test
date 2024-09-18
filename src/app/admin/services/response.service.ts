import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface ResendResponseResult {
	success: boolean;
	message: string;
}

interface ResendResponseResult {
	success: boolean;
	message: string;
}

interface ApiResponse {
	statusCode: number;
	headers: {
		'Content-Type': string;
		'Access-Control-Allow-Origin': string;
		'Access-Control-Allow-Headers': string;
		'Access-Control-Allow-Methods': string;
	};
	body: string; // This will be a JSON string containing ResendResponseResult
}

@Injectable({
	providedIn: 'root',
})
export class ResendResponseService {
	constructor(private readonly http: HttpClient) {}

	public resendResponse(responseId: number): Observable<ResendResponseResult> {
		const url = `${environment.apiUrl}/send-response`;
		return this.http
			.post<ApiResponse>(url, { responseId })
			.pipe(map((response: ApiResponse) => JSON.parse(response.body) as ResendResponseResult));
	}
}
