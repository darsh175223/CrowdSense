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
    <div class="min-h-screen bg-[var(--background)] overflow-y-auto">
      <div class="p-6 pb-10 max-w-[500px] mx-auto">
        <!-- Header with Back Button -->
        <div class="pt-4 pb-2 animate-initial animate-fade-in-up delay-100">
          <button class="flex items-center gap-1 bg-none border-none text-[var(--primary)] text-base font-medium cursor-pointer py-2 pr-4 pl-0 transition-all duration-200 hover:opacity-80 active:scale-95" (click)="goBack()" id="btn-back">
            <span class="text-xl">←</span> Back
          </button>
        </div>

        <!-- Title Section -->
        <div class="mt-6 mb-8 animate-initial animate-fade-in-up delay-200">
          <h1 class="text-[2rem] font-bold text-[var(--text-primary)] mb-2">Create Account</h1>
          <p class="text-base text-[var(--text-secondary)] leading-relaxed">
            Join TrafficTrend and start optimizing your staffing today.
          </p>
        </div>

        <!-- Form -->
        <form class="flex flex-col gap-5" (ngSubmit)="handleSignUp()" #signUpForm="ngForm">
          <!-- Name Row -->
          <div class="flex flex-col sm:flex-row gap-4 animate-initial animate-fade-in-up delay-300">
            <div class="flex-1">
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2" for="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                class="w-full bg-[var(--input-bg)] border-2 border-[var(--border)] rounded-xl py-3.5 px-4 text-base text-[var(--text-primary)] transition-all duration-200 focus:border-[var(--border-focus)] focus:scale-[1.01]"
                placeholder="John"
                [(ngModel)]="firstName"
                [class.border-[var(--border-focus)]]="firstNameFocused"
                [class.scale-[1.01]]="firstNameFocused"
                (focus)="firstNameFocused = true"
                (blur)="firstNameFocused = false"
                autocomplete="given-name"
                required
              />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2" for="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                class="w-full bg-[var(--input-bg)] border-2 border-[var(--border)] rounded-xl py-3.5 px-4 text-base text-[var(--text-primary)] transition-all duration-200 focus:border-[var(--border-focus)] focus:scale-[1.01]"
                placeholder="Doe"
                [(ngModel)]="lastName"
                [class.border-[var(--border-focus)]]="lastNameFocused"
                [class.scale-[1.01]]="lastNameFocused"
                (focus)="lastNameFocused = true"
                (blur)="lastNameFocused = false"
                autocomplete="family-name"
                required
              />
            </div>
          </div>

          <!-- Email -->
          <div class="w-full animate-initial animate-fade-in-up delay-400">
            <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2" for="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              class="w-full bg-[var(--input-bg)] border-2 border-[var(--border)] rounded-xl py-3.5 px-4 text-base text-[var(--text-primary)] transition-all duration-200 focus:border-[var(--border-focus)] focus:scale-[1.01]"
              placeholder="john.doe@example.com"
              [(ngModel)]="email"
              [class.border-[var(--border-focus)]]="emailFocused"
              [class.scale-[1.01]]="emailFocused"
              (focus)="emailFocused = true"
              (blur)="emailFocused = false"
              autocomplete="email"
              required
            />
          </div>

          <!-- Password -->
          <div class="w-full animate-initial animate-fade-in-up delay-500">
            <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2" for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              class="w-full bg-[var(--input-bg)] border-2 border-[var(--border)] rounded-xl py-3.5 px-4 text-base text-[var(--text-primary)] transition-all duration-200 focus:border-[var(--border-focus)] focus:scale-[1.01]"
              placeholder="Create a strong password"
              [(ngModel)]="password"
              [class.border-[var(--border-focus)]]="passwordFocused"
              [class.scale-[1.01]]="passwordFocused"
              (focus)="passwordFocused = true"
              (blur)="passwordFocused = false"
              autocomplete="new-password"
              required
            />
          </div>

          <!-- Confirm Password -->
          <div class="w-full animate-initial animate-fade-in-up delay-600">
            <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2" for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              class="w-full bg-[var(--input-bg)] border-2 border-[var(--border)] rounded-xl py-3.5 px-4 text-base text-[var(--text-primary)] transition-all duration-200 focus:border-[var(--border-focus)] focus:scale-[1.01]"
              placeholder="Confirm your password"
              [(ngModel)]="confirmPassword"
              [class.border-[var(--border-focus)]]="confirmPasswordFocused"
              [class.scale-[1.01]]="confirmPasswordFocused"
              (focus)="confirmPasswordFocused = true"
              (blur)="confirmPasswordFocused = false"
              autocomplete="new-password"
              required
            />
          </div>

          <!-- Error Message -->
          <div class="mt-[-8px]" *ngIf="errorMessage">
            <div class="flex items-center gap-2 p-3 px-4 bg-[rgba(239,68,68,0.1)] rounded-lg text-[var(--error)] text-sm animate-fade-in">
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
            class="w-full h-14 bg-[var(--primary)] text-white border-none rounded-xl text-lg font-bold cursor-pointer transition-all duration-200 ease-in-out shadow-[var(--shadow-primary)] mt-3 flex items-center justify-center hover:bg-[var(--primary-hover)] hover:-translate-y-0.5 hover:shadow-[0_6px_12px_rgba(59,130,246,0.4)] active:scale-[0.96] disabled:opacity-70 disabled:cursor-not-allowed animate-initial animate-fade-in-up delay-700"
            [disabled]="loading"
            id="btn-create-account"
          >
            <span *ngIf="!loading">Create Account</span>
            <span *ngIf="loading" class="flex items-center gap-2">
              <span class="w-5 h-5 border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full animate-spin"></span>
              Creating Account...
            </span>
          </button>

          <!-- Divider -->
          <div class="flex items-center my-2 animate-initial animate-fade-in-up delay-700">
            <div class="flex-1 h-px bg-[var(--border)]"></div>
            <span class="text-[var(--text-muted)] text-sm mx-4">or</span>
            <div class="flex-1 h-px bg-[var(--border)]"></div>
          </div>

          <!-- Navigate to Login -->
          <div class="flex justify-center items-center gap-1 animate-initial animate-fade-in-up delay-700">
            <span class="text-[var(--text-secondary)] text-base">Already have an account?</span>
            <button type="button" class="bg-none border-none text-[var(--primary)] text-base font-bold cursor-pointer transition-opacity duration-200 hover:opacity-70" (click)="navigateToLogin()">
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Modal -->
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-6" *ngIf="showSuccessModal" (click)="closeSuccessModal()">
      <div class="bg-[var(--surface)] rounded-[24px] p-8 max-w-[400px] w-full text-center border border-[var(--border)] animate-scale-in" (click)="$event.stopPropagation()">
        <div class="mb-4">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="22" stroke="#10B981" stroke-width="4"/>
            <path d="M14 24L21 31L34 18" stroke="#10B981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-2">Success!</h2>
        <p class="text-base text-[var(--text-secondary)] mb-6">User registered successfully!</p>
        <button class="w-full h-12 bg-[var(--primary)] text-white border-none rounded-xl text-base font-bold cursor-pointer transition-all duration-200 hover:bg-[var(--primary-hover)]" (click)="closeSuccessModal()">OK</button>
      </div>
    </div>
  `,
  styles: []
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
