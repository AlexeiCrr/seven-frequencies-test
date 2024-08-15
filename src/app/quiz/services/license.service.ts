import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface LicenseCheckResponse {
	isValid: boolean;
	message: string;
}

@Injectable({
	providedIn: 'root',
})
export class LicenseService {
	constructor(private readonly http: HttpClient) {}

	public checkLicenseCode(licenseCode: string): Observable<LicenseCheckResponse> {
		const url = `${environment.apiUrl}/tac-get-code?licenseCode=${licenseCode}`;
		return this.http.get<LicenseCheckResponse>(url);
	}
}
