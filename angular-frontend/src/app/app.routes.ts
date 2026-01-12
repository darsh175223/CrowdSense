import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/splash/splash.component').then(m => m.SplashComponent),
    title: 'TrafficTrend - Optimize Staffing with AI'
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/sign-up/sign-up.component').then(m => m.SignUpComponent),
    title: 'Create Account - TrafficTrend'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Log In - TrafficTrend'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard - TrafficTrend'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
