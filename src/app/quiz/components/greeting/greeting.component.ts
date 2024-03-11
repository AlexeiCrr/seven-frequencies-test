import {
  ChangeDetectionStrategy,
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

import { Subscription } from 'rxjs';
import { GreetingFormData } from 'src/app/quiz/interfaces/greeting';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
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

  private readonly subscriptions = new Subscription();

  @Output() public startClick: EventEmitter<GreetingFormData> =
    new EventEmitter();

  public ngOnInit(): void {
    this.subscriptions.add(
      this.form.valueChanges.subscribe((formValue) => {
        if (formValue.country !== this.defaultCountry) {
          this.isStateVisible = false;
        }
      })
    );
  }

  public constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl(''),
      jobTitle: new FormControl(''),
      company: new FormControl(''),
      country: new FormControl(this.defaultCountry, Validators.required),
      hasSubscribed: new FormControl(false, Validators.requiredTrue),
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
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
