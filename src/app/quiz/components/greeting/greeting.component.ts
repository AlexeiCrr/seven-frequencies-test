import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Output,
} from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	FormGroupDirective,
	NgForm,
	Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription, take } from 'rxjs';
import { GreetingFormData } from 'src/app/quiz/interfaces/greeting';
import { LicenseCheckResponse } from 'src/app/quiz/interfaces/license';
import { LicenseService } from 'src/app/quiz/services/license.service';

import { debounce } from 'lodash';
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
	selector: 'app-greeting',
	templateUrl: './greeting.component.html',
	styleUrls: ['./greeting.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreetingComponent {
	public form: FormGroup;
	public matcher = new MyErrorStateMatcher();
	public phoneNumberMask = '000-000-0000';
	public isStateVisible = true;
	public defaultCountry = 'United States of America';
	public isCheckingLicense = false;
	public licenseValid = false;

	private readonly subscriptions = new Subscription();

	@Output() public startClick: EventEmitter<GreetingFormData> = new EventEmitter();

	public ngOnInit(): void {
		this.subscriptions.add(
			this.route.queryParams.subscribe((params) => {
				const licenseCode = params['licenseCode'];
				if (licenseCode) {
					this.form.get('licenseCode')?.setValue(licenseCode);
				}
			})
		);

		this.subscriptions.add(
			this.form.valueChanges.subscribe((formValue) => {
				if (formValue.country !== this.defaultCountry) {
					this.isStateVisible = false;
				}
			})
		);
		this.subscriptions.add(
			this.form.get('licenseCode')?.valueChanges.subscribe((value: string) => {
				this.onPromoCodeEntered();
			})
		);
	}

	public constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private cdr: ChangeDetectorRef,
		private licenseService: LicenseService
	) {
		this.form = this.formBuilder.group({
			firstName: new FormControl('', Validators.required),
			lastName: new FormControl('', Validators.required),
			email: new FormControl('', [Validators.required, Validators.email]),
			address: new FormControl(''),
			jobTitle: new FormControl(''),
			company: new FormControl(''),
			country: new FormControl(this.defaultCountry, Validators.required),
			hasSubscribed: new FormControl(false, Validators.requiredTrue),
			licenseCode: new FormControl('', Validators.required),
		});
	}

	public onStartClick(event): void {
		event.preventDefault();
		this.startClick.emit({
			firstName: this.form.value.firstName,
			lastName: this.form.value.lastName,
			email: this.form.value.email,
			address: this.form.value.address,
			jobTitle: this.form.value.jobTitle,
			company: this.form.value.jobTitle,
			hasSubscribed: this.form.value.hasSubscribed,
			licenseCode: this.form.value.licenseCode,
		});
	}

	public onPromoCodeEntered(): void {
		const licenseCodeControl = this.form.get('licenseCode');
		const licenseCode = licenseCodeControl?.value;
		this.licenseValid = false;
		if (licenseCode) {
			this.isCheckingLicense = true;

			const debounced = debounce(() => {
				this.licenseService
					.checkLicenseCode(licenseCode)
					.pipe(take(1))
					.subscribe({
						next: (response: LicenseCheckResponse) => {
							this.isCheckingLicense = false;
							if (response.isValid) {
								licenseCodeControl?.setErrors(null);
								this.licenseValid = true;
							} else {
								console.log('The license code is invalid or taken');
								licenseCodeControl?.setErrors({ taken: true });
								this.licenseValid = false;
							}
							licenseCodeControl?.markAsTouched();
							this.cdr.detectChanges();
						},
						error: (error) => {
							this.isCheckingLicense = false;
							console.error('Error checking license code:', error);
							licenseCodeControl?.setErrors({ serverError: true });
							this.licenseValid = false;
							licenseCodeControl?.markAsTouched();
							this.cdr.detectChanges();
						},
					});
			}, 500);

			debounced();
		}
	}

	public ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
