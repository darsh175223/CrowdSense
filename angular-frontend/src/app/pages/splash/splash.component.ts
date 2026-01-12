import { Component, OnInit, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="splash-container">
      <div class="content">
        <!-- Logo/Icon -->
        <div class="icon-container animate-initial animate-scale-in">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <h1 class="headline animate-initial animate-fade-in-up delay-300">
          Optimize Staffing with TrafficTrend
        </h1>

        <!-- Subheading -->
        <p class="subheading animate-initial animate-fade-in-up delay-400">
          Predict foot traffic and align your team effortlessly.
        </p>

        <!-- Buttons Container -->
        <div class="buttons-container">
          <button 
            class="btn btn-primary animate-initial animate-fade-in-up delay-500"
            (click)="navigateToSignUp()"
            id="btn-signup"
          >
            Sign Up
          </button>
          <button 
            class="btn btn-secondary animate-initial animate-fade-in-up delay-600"
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
    .splash-container {
      min-height: 100vh;
      background-color: var(--background);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 24px;
    }

    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 500px;
      width: 100%;
    }

    .icon-container {
      margin-bottom: 32px;
    }

    .icon-container svg {
      animation: iconEntrance 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

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

    /* SVG Animations */
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

    .headline {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      text-align: left;
      width: 100%;
      line-height: 1.2;
    }

    .subheading {
      font-size: 1.125rem;
      font-weight: 400;
      color: var(--text-secondary);
      text-align: left;
      width: 100%;
      margin-top: 12px;
    }

    .buttons-container {
      width: 100%;
      margin-top: 40px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .btn {
      width: 80%;
      max-width: 320px;
      height: 56px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1.125rem;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      align-self: center;
    }

    .btn:active {
      transform: scale(0.96);
    }

    .btn-primary {
      background-color: var(--primary);
      color: #FFFFFF;
      box-shadow: var(--shadow-primary);
    }

    .btn-primary:hover {
      background-color: var(--primary-hover);
      box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
      transform: translateY(-2px);
    }

    .btn-primary:active {
      transform: scale(0.96) translateY(0);
    }

    .btn-secondary {
      background-color: transparent;
      color: var(--primary);
      border: 2px solid var(--primary);
    }

    .btn-secondary:hover {
      background-color: rgba(59, 130, 246, 0.1);
      transform: translateY(-2px);
    }

    .btn-secondary:active {
      transform: scale(0.96) translateY(0);
    }

    @media (max-width: 480px) {
      .headline {
        font-size: 1.75rem;
      }

      .subheading {
        font-size: 1rem;
      }

      .btn {
        width: 90%;
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
