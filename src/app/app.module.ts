// Angular core modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// NGRX modules
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { quizReducer } from './quiz/reducers/quiz.reducer';
import { QuizEffects } from './quiz/effects/quiz.effects';
import { AdminEffects } from './admin/effects/admin.effects';
import { adminReducer } from './admin/reducers/admin.reducers';

// Material modules
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Internal modules
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { QuizModule } from './quiz/quiz.module';
import { AdminModule } from './admin/admin.module';
import { HttpClientModule } from '@angular/common/http';
import { provideEnvironmentNgxMask } from 'ngx-mask';

const ngrxReducers = {
  quizStore: quizReducer,
  adminStore: adminReducer,
};

const ngrxEffects = [QuizEffects, AdminEffects];

const ngrxSettings = {
  runtimeChecks: {
    strictStateImmutability: true,
    strictActionImmutability: true,
  },
};

const ngrxStoreDevtoolsSettings = {
  maxAge: 25,
};

const MatModules = [
  MatRadioModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatProgressBarModule,
  MatInputModule,
  MatButtonToggleModule,
  MatProgressSpinnerModule,
];

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    QuizModule,
    AdminModule,
    ...MatModules,
    StoreModule.forRoot(ngrxReducers, ngrxSettings),
    EffectsModule.forRoot(ngrxEffects),
    StoreDevtoolsModule.instrument(ngrxStoreDevtoolsSettings),
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [provideEnvironmentNgxMask()],
  bootstrap: [AppComponent],
})
export class AppModule {}
