import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutes } from './shared/app-routes.enum';
import { authGuard, loggedOutGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: AppRoutes.LOGIN,
    canMatch: [loggedOutGuard],
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: AppRoutes.HOME,
    canMatch: [authGuard],
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
