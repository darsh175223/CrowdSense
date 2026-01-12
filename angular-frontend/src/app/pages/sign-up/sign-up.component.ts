import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, RegisterData, ApiError } from '../../services/api.service';

@Component({
  selector: 'app-sign-up',
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
          <h1 class="title">Create Account</h1>
          <p class="subtitle">
            Join TrafficTrend and start optimizing your staffing today.
          </p>
        </div>

        <!-- Form -->
        <form class="form" (ngSubmit)="handleSignUp()" #signUpForm="ngForm">
          <!-- Name Row -->
          <div class="row animate-initial animate-fade-in-up delay-300">
            <div class="half-input">
              <label class="label" for="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                class="input"
                placeholder="John"
                [(ngModel)]="firstName"
                [class.input-focused]="firstNameFocused"
                (focus)="firstNameFocused = true"
                (blur)="firstNameFocused = false"
                autocomplete="given-name"
                required
              />
            </div>
            <div class="half-input">
              <label class="label" for="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                class="input"
                placeholder="Doe"
                [(ngModel)]="lastName"
                [class.input-focused]="lastNameFocused"
                (focus)="lastNameFocused = true"
                (blur)="lastNameFocused = false"
                autocomplete="family-name"
                required
              />
            </div>
          </div>

          <!-- Email -->
          <div class="input-container animate-initial animate-fade-in-up delay-400">
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
          <div class="input-container animate-initial animate-fade-in-up delay-500">
            <label class="label" for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              class="input"
              placeholder="Create a strong password"
              [(ngModel)]="password"
              [class.input-focused]="passwordFocused"
              (focus)="passwordFocused = true"
              (blur)="passwordFocused = false"
              autocomplete="new-password"
              required
            />
          </div>

          <!-- Confirm Password -->
          <div class="input-container animate-initial animate-fade-in-up delay-600">
            <label class="label" for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              class="input"
              placeholder="Confirm your password"
              [(ngModel)]="confirmPassword"
              [class.input-focused]="confirmPasswordFocused"
              (focus)="confirmPasswordFocused = true"
              (blur)="confirmPasswordFocused = false"
              autocomplete="new-password"
              required
            />
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

          <!-- Sign Up Button -->
          <button 
            type="submit"
            class="submit-button animate-initial animate-fade-in-up delay-700"
            [disabled]="loading"
            [class.loading]="loading"
            id="btn-create-account"
          >
            <span *ngIf="!loading">Create Account</span>
            <span *ngIf="loading" class="loading-content">
              <span class="spinner"></span>
              Creating Account...
            </span>
          </button>

          <!-- Divider -->
          <div class="divider-container animate-initial animate-fade-in-up delay-700">
            <div class="divider"></div>
            <span class="divider-text">or</span>
            <div class="divider"></div>
          </div>

          <!-- Navigate to Login -->
          <div class="switch-container animate-initial animate-fade-in-up delay-700">
            <span class="switch-text">Already have an account?</span>
            <button type="button" class="switch-link" (click)="navigateToLogin()">
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Modal -->
    <div class="modal-overlay" *ngIf="showSuccessModal" (click)="closeSuccessModal()">
      <div class="modal animate-scale-in" (click)="$event.stopPropagation()">
        <div class="modal-icon success">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="22" stroke="#10B981" stroke-width="4"/>
            <path d="M14 24L21 31L34 18" stroke="#10B981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2 class="modal-title">Success!</h2>
        <p class="modal-message">User registered successfully!</p>
        <button class="modal-button" (click)="closeSuccessModal()">OK</button>
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

    .row {
      display: flex;
      gap: 16px;
    }

    .half-input {
      flex: 1;
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
      .row {
        flex-direction: column;
        gap: 20px;
      }

      .title {
        font-size: 1.75rem;
      }
    }
  `]
})
export class SignUpComponent implements OnInit {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  errorMessage = '';
  showSuccessModal = false;

  // Focus states
  firstNameFocused = false;
  lastNameFocused = false;
  emailFocused = false;
  passwordFocused = false;
  confirmPasswordFocused = false;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {}

  goBack(): void {
    this.router.navigate(['/']);
  }

  async handleSignUp(): Promise<void> {
    this.errorMessage = '';

    // Validation
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;

    const registerData: RegisterData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    };

    this.apiService.register(registerData).subscribe({
      next: () => {
        this.loading = false;
        this.showSuccessModal = true;
      },
      error: (error: ApiError) => {
        this.loading = false;
        this.errorMessage = error.message;
      }
    });
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/login']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
