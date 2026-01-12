import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[var(--background)] flex justify-center items-center p-6">
      <div class="flex flex-col items-center max-w-[500px] w-full">
        <!-- Logo/Icon -->
        <div class="mb-8 animate-initial animate-scale-in">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="animate-icon-entrance">
            <!-- Upward trending arrow -->
            <path 
              d="M15 55 L35 35 L50 45 L70 20" 
              stroke="#3B82F6" 
              stroke-width="4" 
              stroke-linecap="round" 
              stroke-linejoin="round"
              fill="none"
              class="trend-line"
            />
            <!-- Arrow head -->
            <path 
              d="M60 18 L70 20 L68 30" 
              stroke="#3B82F6" 
              stroke-width="4" 
              stroke-linecap="round" 
              stroke-linejoin="round"
              fill="none"
              class="arrow-head"
            />
            <!-- Foot/person dots -->
            <circle cx="25" cy="62" r="4" fill="#3B82F6" class="dot dot-1"/>
            <circle cx="40" cy="58" r="4" fill="#3B82F6" class="dot dot-2"/>
            <circle cx="55" cy="54" r="4" fill="#3B82F6" class="dot dot-3"/>
          </svg>
        </div>

        <!-- Headline -->
        <h1 class="text-[2rem] sm:text-[1.75rem] font-bold text-[var(--text-primary)] w-full text-left leading-tight animate-initial animate-fade-in-up delay-300">
          Optimize Staffing with TrafficTrend
        </h1>

        <!-- Subheading -->
        <p class="text-[1.125rem] sm:text-[1rem] font-normal text-[var(--text-secondary)] w-full text-left mt-3 animate-initial animate-fade-in-up delay-400">
          Predict foot traffic and align your team effortlessly.
        </p>

        <!-- Buttons Container -->
        <div class="w-full mt-10 flex flex-col gap-4">
          <button 
            class="w-[80%] sm:w-[90%] max-w-[320px] h-14 rounded-xl font-bold text-lg bg-[var(--primary)] text-white border-none shadow-[var(--shadow-primary)] cursor-pointer self-center transition-all duration-200 hover:bg-[var(--primary-hover)] hover:translate-y-[-2px] hover:shadow-[0_6px_12px_rgba(59,130,246,0.4)] active:scale-95 animate-initial animate-fade-in-up delay-500"
            (click)="navigateToSignUp()"
            id="btn-signup"
          >
            Sign Up
          </button>
          <button 
            class="w-[80%] sm:w-[90%] max-w-[320px] h-14 rounded-xl font-bold text-lg bg-transparent text-[var(--primary)] border-2 border-[var(--primary)] cursor-pointer self-center transition-all duration-200 hover:bg-[rgba(59,130,246,0.1)] hover:translate-y-[-2px] active:scale-95 animate-initial animate-fade-in-up delay-600"
            (click)="navigateToLogin()"
            id="btn-login"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes iconEntrance {
      from {
        opacity: 0;
        transform: scale(0.5) rotate(-10deg);
      }
      to {
        opacity: 1;
        transform: scale(1) rotate(0deg);
      }
    }

    .animate-icon-entrance {
      animation: iconEntrance 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    .trend-line {
      stroke-dasharray: 200;
      stroke-dashoffset: 200;
      animation: drawLine 1s ease-out 0.3s forwards;
    }

    .arrow-head {
      stroke-dasharray: 50;
      stroke-dashoffset: 50;
      animation: drawLine 0.5s ease-out 0.8s forwards;
    }

    @keyframes drawLine {
      to {
        stroke-dashoffset: 0;
      }
    }

    .dot {
      animation: dotPop 0.3s ease-out forwards;
      opacity: 0;
    }

    .dot-1 { animation-delay: 0.4s; }
    .dot-2 { animation-delay: 0.5s; }
    .dot-3 { animation-delay: 0.6s; }

    @keyframes dotPop {
      from {
        opacity: 0;
        transform: scale(0);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `]
})
export class SplashComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateToSignUp(): void {
    this.router.navigate(['/sign-up']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
