import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class FrequencyInfoService {
	constructor(private http: HttpClient) {}

	getFrequencyInfo(): Observable<any> {
		return this.http.get('assets/freq-info.json');
	}
}
