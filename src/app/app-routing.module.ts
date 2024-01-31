import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuizHomeComponent } from './quiz/components/quiz-home/quiz-home.component';
import { AdminHomeComponent } from './admin/components/admin-home/admin-home.component';
import { ResponsePageComponent } from './admin/components/response-page/response-page.component';
import { AuthGuard } from './admin/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: QuizHomeComponent,
  },
  {
    path: '',
    component: QuizHomeComponent,
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    component: AdminHomeComponent,
  },
  {
    path: 'response',
    canActivate: [AuthGuard],
    component: ResponsePageComponent,
  },
  { path: '**', pathMatch: 'prefix', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
