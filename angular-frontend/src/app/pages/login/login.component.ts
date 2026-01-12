import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, LoginData, ApiError } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="scroll-content">
        <!-- Header with Back Button -->
        <div class="header animate-initial animate-fade-in-up delay-100">
          <button class="back-button" (click)="goBack()" id="btn-back">
            <span class="back-arrow">←</span> Back
          </button>
        </div>

        <!-- Title Section -->
        <div class="title-section animate-initial animate-fade-in-up delay-200">
          <h1 class="title">Welcome Back</h1>
          <p class="subtitle">
            Log in to your TrafficTrend account to continue.
          </p>
        </div>

        <!-- Form -->
        <form class="form" (ngSubmit)="handleLogin()" #loginForm="ngForm">
          <!-- Email -->
          <div class="input-container animate-initial animate-fade-in-up delay-300">
            <label class="label" for="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              class="input"
              placeholder="john.doe@example.com"
              [(ngModel)]="email"
              [class.input-focused]="emailFocused"
              (focus)="emailFocused = true"
              (blur)="emailFocused = false"
              autocomplete="email"
              required
            />
          </div>

          <!-- Password -->
          <div class="input-container animate-initial animate-fade-in-up delay-400">
            <label class="label" for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              class="input"
              placeholder="Enter your password"
              [(ngModel)]="password"
              [class.input-focused]="passwordFocused"
              (focus)="passwordFocused = true"
              (blur)="passwordFocused = false"
              autocomplete="current-password"
              required
            />
          </div>

          <!-- Forgot Password -->
          <div class="forgot-container animate-initial animate-fade-in-up delay-400">
            <button type="button" class="forgot-link" (click)="handleForgotPassword()">
              Forgot Password?
            </button>
          </div>

          <!-- Error Message -->
          <div class="error-container" *ngIf="errorMessage">
            <div class="error-message animate-fade-in">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="#EF4444" stroke-width="2"/>
                <path d="M10 6V10M10 14H10.01" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          </div>

          <!-- Log In Button -->
          <button 
            type="submit"
            class="submit-button animate-initial animate-fade-in-up delay-500"
            [disabled]="loading"
            [class.loading]="loading"
            id="btn-login"
          >
            <span *ngIf="!loading">Log In</span>
            <span *ngIf="loading" class="loading-content">
              <span class="spinner"></span>
              Logging In...
            </span>
          </button>

          <!-- Divider -->
          <div class="divider-container animate-initial animate-fade-in-up delay-600">
            <div class="divider"></div>
            <span class="divider-text">or</span>
            <div class="divider"></div>
          </div>

          <!-- Navigate to Sign Up -->
          <div class="switch-container animate-initial animate-fade-in-up delay-600">
            <span class="switch-text">Don't have an account?</span>
            <button type="button" class="switch-link" (click)="navigateToSignUp()">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Error Modal for critical errors -->
    <div class="modal-overlay" *ngIf="showErrorModal" (click)="closeErrorModal()">
      <div class="modal animate-scale-in" (click)="$event.stopPropagation()">
        <div class="modal-icon error">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="22" stroke="#EF4444" stroke-width="4"/>
            <path d="M24 14V26M24 34H24.02" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/>
          </svg>
        </div>
        <h2 class="modal-title">Login Failed</h2>
        <p class="modal-message">{{ modalErrorMessage }}</p>
        <button class="modal-button" (click)="closeErrorModal()">Try Again</button>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      background-color: var(--background);
      overflow-y: auto;
    }

    .scroll-content {
      padding: 24px;
      padding-bottom: 40px;
      max-width: 500px;
      margin: 0 auto;
    }

    .header {
      padding-top: 16px;
      padding-bottom: 8px;
    }

    .back-button {
      display: flex;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      color: var(--primary);
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      padding: 8px 16px 8px 0;
      transition: all 0.2s ease;
    }

    .back-button:hover {
      opacity: 0.8;
    }

    .back-button:active {
      transform: scale(0.95);
    }

    .back-arrow {
      font-size: 1.25rem;
    }

    .title-section {
      margin-top: 24px;
      margin-bottom: 32px;
    }

    .title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .subtitle {
      font-size: 1rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .input-container {
      width: 100%;
    }

    .label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }

    .input {
      width: 100%;
      background-color: var(--input-bg);
      border: 2px solid var(--border);
      border-radius: 12px;
      padding: 14px 16px;
      font-size: 1rem;
      color: var(--text-primary);
      transition: all 0.2s ease;
    }

    .input::placeholder {
      color: var(--text-muted);
    }

    .input:focus,
    .input.input-focused {
      border-color: var(--border-focus);
      transform: scale(1.01);
    }

    .forgot-container {
      display: flex;
      justify-content: flex-end;
      margin-top: -8px;
    }

    .forgot-link {
      background: none;
      border: none;
      color: var(--primary);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .forgot-link:hover {
      opacity: 0.8;
    }

    .forgot-link:active {
      transform: scale(0.95);
    }

    .error-container {
      margin-top: -8px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background-color: rgba(239, 68, 68, 0.1);
      border-radius: 8px;
      color: var(--error);
      font-size: 0.875rem;
    }

    .submit-button {
      width: 100%;
      height: 56px;
      background-color: var(--primary);
      color: #FFFFFF;
      border: none;
      border-radius: 12px;
      font-size: 1.125rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--shadow-primary);
      margin-top: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .submit-button:hover:not(:disabled) {
      background-color: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
    }

    .submit-button:active:not(:disabled) {
      transform: scale(0.96);
    }

    .submit-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .loading-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #FFFFFF;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .divider-container {
      display: flex;
      align-items: center;
      margin: 8px 0;
    }

    .divider {
      flex: 1;
      height: 1px;
      background-color: var(--border);
    }

    .divider-text {
      color: var(--text-muted);
      font-size: 0.875rem;
      margin: 0 16px;
    }

    .switch-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
    }

    .switch-text {
      color: var(--text-secondary);
      font-size: 1rem;
    }

    .switch-link {
      background: none;
      border: none;
      color: var(--primary);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s ease;
    }

    .switch-link:hover {
      opacity: 0.7;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 24px;
    }

    .modal {
      background-color: var(--surface);
      border-radius: 24px;
      padding: 32px;
      max-width: 400px;
      width: 100%;
      text-align: center;
      border: 1px solid var(--border);
    }

    .modal-icon {
      margin-bottom: 16px;
    }

    .modal-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .modal-message {
      font-size: 1rem;
      color: var(--text-secondary);
      margin-bottom: 24px;
    }

    .modal-button {
      width: 100%;
      height: 48px;
      background-color: var(--primary);
      color: #FFFFFF;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .modal-button:hover {
      background-color: var(--primary-hover);
    }

    @media (max-width: 480px) {
      .title {
        font-size: 1.75rem;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  showErrorModal = false;
  modalErrorMessage = '';

  // Focus states
  emailFocused = false;
  passwordFocused = false;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Check if already authenticated
    if (this.apiService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  async handleLogin(): Promise<void> {
    this.errorMessage = '';

    // Validation
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.loading = true;

    const loginData: LoginData = {
      email: this.email,
      password: this.password
    };

    this.apiService.login(loginData).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Login success', response);
        if (response.token) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error: ApiError) => {
        this.loading = false;
        this.errorMessage = error.message;
        
        // Show modal for network errors
        if (error.status === 0 || error.status === 500) {
          this.modalErrorMessage = error.message;
          this.showErrorModal = true;
        }
      }
    });
  }

  handleForgotPassword(): void {
    console.log('Forgot password pressed');
    // TODO: Implement forgot password functionality
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
    this.modalErrorMessage = '';
  }

  navigateToSignUp(): void {
    this.router.navigate(['/sign-up']);
  }
}
