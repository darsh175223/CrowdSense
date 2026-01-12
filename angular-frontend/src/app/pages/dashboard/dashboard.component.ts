import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { 
  ApiService, 
  ApiError, 
  StaffingResponse, 
  ForecastResponse, 
  PredictionResponse,
  StaffingScheduleItem 
} from '../../services/api.service';

type TabId = 'input' | 'staffing' | 'forecast';

interface ChartPoint {
  x: number;
  y: number;
  value: number;
  label: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[var(--background)] flex flex-col">
      <!-- Header -->
      <header class="bg-[var(--background)] border-b border-[var(--border)] px-6 py-4 sticky top-0 z-[100]">
        <div class="max-w-[800px] mx-auto flex justify-between items-center">
          <div class="flex flex-col">
            <h1 class="text-[1.25rem] font-bold text-[var(--text-primary)] m-0">Welcome to TrafficTrend</h1>
            <p class="text-[0.875rem] text-[var(--text-secondary)] m-0">Dashboard</p>
          </div>
          <button class="p-2 bg-[var(--surface)] border-none rounded-lg text-[var(--text-secondary)] cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] hover:scale-105 active:scale-95" (click)="handleLogout()" id="btn-logout" title="Logout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="16,17 21,12 16,7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-6 overflow-y-auto pb-[100px]">
        <!-- Input Tab -->
        <div class="max-w-[800px] mx-auto animate-fade-in" *ngIf="activeTab === 'input'">
          <div class="bg-[var(--surface)] rounded-[24px] p-8 border border-[var(--border)] shadow-[var(--shadow-lg)] flex flex-col items-center">
            <div class="w-16 h-16 rounded-full bg-[rgba(59,130,246,0.1)] flex items-center justify-center mb-5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h2 class="text-[1.5rem] font-bold text-[var(--text-primary)] mb-2 text-center">Daily Traffic Input</h2>
            <p class="text-[1rem] text-[var(--text-secondary)] mb-8 text-center">How many customers did you have today?</p>

            <div class="input-container">
              <input
                type="number"
                class="number-input"
                placeholder="0"
                [(ngModel)]="customerCount"
                [class.input-focused]="customerInputFocused"
                (focus)="customerInputFocused = true"
                (blur)="customerInputFocused = false"
                id="customer-count-input"
              />
            </div>

            <!-- Error Message -->
            <div class="error-container" *ngIf="inputError">
              <div class="error-message animate-fade-in">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="#EF4444" stroke-width="2"/>
                  <path d="M10 6V10M10 14H10.01" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>{{ inputError }}</span>
              </div>
            </div>

            <button 
              class="primary-button"
              (click)="handleEnterCustomerCount()"
              [disabled]="inputLoading"
              id="btn-enter-data"
            >
              <span *ngIf="!inputLoading">Enter Data</span>
              <span *ngIf="inputLoading" class="loading-content">
                <span class="spinner"></span>
                Submitting...
              </span>
            </button>
          </div>
        </div>

        <!-- Staffing Tab -->
        <div class="max-w-[800px] mx-auto animate-fade-in" *ngIf="activeTab === 'staffing'">
          <div class="bg-[var(--surface)] rounded-[24px] p-8 border border-[var(--border)] shadow-[var(--shadow-lg)] flex flex-col items-center">
            <div class="w-16 h-16 rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center mb-5">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#10B981" stroke-width="2"/>
                <circle cx="9" cy="7" r="4" stroke="#10B981" stroke-width="2"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#10B981" stroke-width="2"/>
                <circle cx="20" cy="8" r="2" fill="#10B981"/>
                <path d="M19 8H21M20 7V9" stroke="#1E293B" stroke-width="1"/>
              </svg>
            </div>
            <h2 class="text-[1.5rem] font-bold text-[var(--text-primary)] mb-2 text-center">Staffing Schedule</h2>
            <p class="text-[1rem] text-[var(--text-secondary)] mb-8 text-center">Recommended staff levels based on traffic.</p>

            <!-- Loading State -->
            <div class="loading-container" *ngIf="loadingStaffing">
              <div class="spinner large"></div>
              <p class="loading-text">Analyzing local patterns...</p>
            </div>

            <!-- Error State -->
            <div class="error-state" *ngIf="staffingError && !loadingStaffing">
              <p class="error-text">{{ staffingError }}</p>
              <button class="primary-button" (click)="loadStaffing()">Retry</button>
            </div>

            <!-- Chart and Data -->
            <div class="staffing-content" *ngIf="staffingData && !loadingStaffing && !staffingError">
              <!-- SVG Chart -->
              <div class="chart-container">
                <svg [attr.width]="chartWidth" height="220" class="chart">
                  <!-- Background grid lines -->
                  <g class="grid-lines">
                    <line *ngFor="let tick of [0, 1, 2, 3, 4]"
                          x1="40" 
                          [attr.x2]="chartWidth - 20"
                          [attr.y1]="40 + tick * 40"
                          [attr.y2]="40 + tick * 40"
                          stroke="rgba(148, 163, 184, 0.2)"
                          stroke-width="1"/>
                  </g>
                  
                  <!-- Y-axis labels -->
                  <g class="y-axis">
                    <text *ngFor="let tick of staffingYAxisTicks; let i = index"
                          x="35" 
                          [attr.y]="200 - i * 40"
                          fill="#94A3B8"
                          font-size="12"
                          text-anchor="end">{{ tick }}</text>
                  </g>

                  <!-- Chart line -->
                  <path 
                    [attr.d]="staffingLinePath"
                    fill="none"
                    stroke="#10B981"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="chart-line"/>

                  <!-- Area fill -->
                  <path 
                    [attr.d]="staffingAreaPath"
                    fill="url(#staffingGradient)"
                    opacity="0.3"/>

                  <!-- Data points -->
                  <g class="data-points">
                    <circle 
                      *ngFor="let point of staffingChartPoints; let i = index"
                      [attr.cx]="point.x"
                      [attr.cy]="point.y"
                      r="5"
                      fill="#10B981"
                      stroke="#1E293B"
                      stroke-width="2"
                      class="data-point"
                      (click)="showStaffingTooltip(point)"
                      [class.active]="activeTooltip === i"/>
                  </g>

                  <!-- X-axis labels -->
                  <g class="x-axis">
                    <text *ngFor="let label of staffingXAxisLabels; let i = index"
                          [attr.x]="getXAxisPosition(i, staffingXAxisLabels.length)"
                          y="215"
                          fill="#94A3B8"
                          font-size="10"
                          text-anchor="middle">{{ label }}</text>
                  </g>

                  <!-- Gradient definition -->
                  <defs>
                    <linearGradient id="staffingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#10B981" stop-opacity="0.4"/>
                      <stop offset="100%" stop-color="#10B981" stop-opacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <!-- Info Box -->
              <div class="info-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#10B981" stroke-width="2"/>
                  <path d="M12 16V12M12 8H12.01" stroke="#10B981" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <p>Staff levels are optimized for the predicted pedestrian flow today. Tap points for details.</p>
              </div>

              <!-- Staffing Table -->
              <div class="table-section">
                <h3 class="table-title">Hourly Breakdown</h3>
                <div class="table-header">
                  <span class="table-col">Time</span>
                  <span class="table-col center">Traffic</span>
                  <span class="table-col right">Staff</span>
                </div>
                <div class="table-body">
                  <div class="table-row" *ngFor="let item of staffingSchedule">
                    <span class="table-col">{{ item.time }}</span>
                    <span class="table-col center">{{ item.predicted_pedestrians }}</span>
                    <span class="table-col right success-text">{{ item.recommended_staff }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Forecast Tab -->
        <div class="max-w-[800px] mx-auto animate-fade-in" *ngIf="activeTab === 'forecast'">
          <div class="bg-[var(--surface)] rounded-[24px] p-8 border border-[var(--border)] shadow-[var(--shadow-lg)] flex flex-col items-center">
            <div class="w-16 h-16 rounded-full bg-[rgba(59,130,246,0.1)] flex items-center justify-center mb-5">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3V21H21" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 12L12 7L16 11L21 6" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h2 class="text-[1.5rem] font-bold text-[var(--text-primary)] mb-2 text-center">Traffic History</h2>
            <p class="text-[1rem] text-[var(--text-secondary)] mb-8 text-center">Recorded customer volume over time.</p>

            <!-- Loading State -->
            <div class="loading-container" *ngIf="loadingForecast">
              <div class="spinner large"></div>
              <p class="loading-text">Loading Data...</p>
            </div>

            <!-- Error State -->
            <div class="error-state" *ngIf="forecastError && !loadingForecast">
              <p class="error-text">{{ forecastError }}</p>
              <button class="primary-button" (click)="loadForecast()">Retry</button>
            </div>

            <!-- Chart -->
            <div class="forecast-content" *ngIf="forecastData && !loadingForecast && !forecastError">
              <!-- SVG Chart -->
              <div class="chart-container">
                <svg [attr.width]="chartWidth" height="220" class="chart">
                  <!-- Background grid lines -->
                  <g class="grid-lines">
                    <line *ngFor="let tick of [0, 1, 2, 3, 4]"
                          x1="40" 
                          [attr.x2]="chartWidth - 20"
                          [attr.y1]="40 + tick * 40"
                          [attr.y2]="40 + tick * 40"
                          stroke="rgba(148, 163, 184, 0.2)"
                          stroke-width="1"/>
                  </g>

                  <!-- Y-axis labels -->
                  <g class="y-axis">
                    <text *ngFor="let tick of forecastYAxisTicks; let i = index"
                          x="35" 
                          [attr.y]="200 - i * 40"
                          fill="#94A3B8"
                          font-size="12"
                          text-anchor="end">{{ tick }}</text>
                  </g>

                  <!-- Chart line -->
                  <path 
                    [attr.d]="forecastLinePath"
                    fill="none"
                    stroke="#3B82F6"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="chart-line"/>

                  <!-- Area fill -->
                  <path 
                    [attr.d]="forecastAreaPath"
                    fill="url(#forecastGradient)"
                    opacity="0.3"/>

                  <!-- Data points -->
                  <g class="data-points">
                    <circle 
                      *ngFor="let point of forecastChartPoints; let i = index"
                      [attr.cx]="point.x"
                      [attr.cy]="point.y"
                      r="4"
                      fill="#3B82F6"
                      stroke="#1E293B"
                      stroke-width="2"
                      class="data-point"
                      (click)="showForecastTooltip(point)"/>
                  </g>

                  <!-- X-axis labels -->
                  <g class="x-axis">
                    <text *ngFor="let label of forecastXAxisLabels; let i = index"
                          [attr.x]="getXAxisPosition(i, forecastXAxisLabels.length)"
                          y="215"
                          fill="#94A3B8"
                          font-size="10"
                          text-anchor="middle">{{ label }}</text>
                  </g>

                  <defs>
                    <linearGradient id="forecastGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.4"/>
                      <stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <!-- Prediction Section -->
              <div class="prediction-section">
                <!-- Prediction Error -->
                <div class="error-text" *ngIf="predictionError">{{ predictionError }}</div>
                
                <button 
                  class="primary-button"
                  (click)="handlePredictFuture()"
                  [disabled]="loadingPrediction"
                  id="btn-predict"
                >
                  <span *ngIf="!loadingPrediction">Predict Tomorrow's Traffic</span>
                  <span *ngIf="loadingPrediction" class="loading-content">
                    <span class="spinner"></span>
                    Predicting...
                  </span>
                </button>

                <!-- Prediction Result -->
                <div class="prediction-result animate-scale-in" *ngIf="predictionResult">
                  <div class="prediction-header">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="#3B82F6" stroke-width="2"/>
                      <circle cx="12" cy="12" r="4" fill="#3B82F6"/>
                      <path d="M12 2C12 2 14 6 14 12C14 18 12 22 12 22" stroke="#3B82F6" stroke-width="1.5"/>
                      <path d="M2 12C2 12 6 10 12 10C18 10 22 12 22 12" stroke="#3B82F6" stroke-width="1.5"/>
                    </svg>
                    <span class="prediction-label">AI Prediction</span>
                  </div>
                  <p class="prediction-subtitle">Tomorrow's estimate:</p>
                  <div class="prediction-value">
                    <span class="value">{{ predictionResult }}</span>
                    <span class="unit">customers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav">
        <button 
          class="nav-item" 
          [class.active]="activeTab === 'input'"
          (click)="setActiveTab('input')"
          id="nav-input"
        >
          <div class="nav-icon-wrapper">
            <div class="nav-icon-bg" [class.active]="activeTab === 'input'"></div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4C3.44772 4 3 4.44772 3 5V11C3 11.5523 3.44772 12 4 12H11C11.5523 12 12 11.5523 12 11V5C12 4.44772 11.5523 4 11 4Z" 
                    [attr.stroke]="activeTab === 'input' ? '#3B82F6' : '#94A3B8'" stroke-width="2"/>
              <path d="M20 4H13" [attr.stroke]="activeTab === 'input' ? '#3B82F6' : '#94A3B8'" stroke-width="2" stroke-linecap="round"/>
              <path d="M20 8H13" [attr.stroke]="activeTab === 'input' ? '#3B82F6' : '#94A3B8'" stroke-width="2" stroke-linecap="round"/>
              <path d="M20 12H13" [attr.stroke]="activeTab === 'input' ? '#3B82F6' : '#94A3B8'" stroke-width="2" stroke-linecap="round"/>
              <path d="M4 16H20" [attr.stroke]="activeTab === 'input' ? '#3B82F6' : '#94A3B8'" stroke-width="2" stroke-linecap="round"/>
              <path d="M4 20H14" [attr.stroke]="activeTab === 'input' ? '#3B82F6' : '#94A3B8'" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="nav-label" [class.active]="activeTab === 'input'">Input</span>
        </button>

        <button 
          class="nav-item" 
          [class.active]="activeTab === 'staffing'"
          (click)="setActiveTab('staffing')"
          id="nav-staffing"
        >
          <div class="nav-icon-wrapper">
            <div class="nav-icon-bg" [class.active]="activeTab === 'staffing'"></div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" 
                    [attr.stroke]="activeTab === 'staffing' ? '#3B82F6' : '#94A3B8'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="7" r="4" 
                      [attr.stroke]="activeTab === 'staffing' ? '#3B82F6' : '#94A3B8'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M23 12H17" [attr.stroke]="activeTab === 'staffing' ? '#3B82F6' : '#94A3B8'" stroke-width="2" stroke-linecap="round"/>
              <path d="M20 9V15" [attr.stroke]="activeTab === 'staffing' ? '#3B82F6' : '#94A3B8'" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="nav-label" [class.active]="activeTab === 'staffing'">Staffing</span>
        </button>

        <button 
          class="nav-item" 
          [class.active]="activeTab === 'forecast'"
          (click)="setActiveTab('forecast')"
          id="nav-forecast"
        >
          <div class="nav-icon-wrapper">
            <div class="nav-icon-bg" [class.active]="activeTab === 'forecast'"></div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3V21H21" [attr.stroke]="activeTab === 'forecast' ? '#3B82F6' : '#94A3B8'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7 12L12 7L16 11L21 6" [attr.stroke]="activeTab === 'forecast' ? '#3B82F6' : '#94A3B8'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="nav-label" [class.active]="activeTab === 'forecast'">Forecast</span>
        </button>
      </nav>
    </div>

    <!-- Tooltip -->
    <div class="tooltip animate-scale-in" *ngIf="tooltipVisible" 
         [style.left.px]="tooltipX" 
         [style.top.px]="tooltipY">
      <div class="tooltip-content">{{ tooltipContent }}</div>
    </div>

    <!-- Success Modal -->
    <div class="modal-overlay" *ngIf="showSuccessModal" (click)="closeSuccessModal()">
      <div class="modal animate-scale-in" (click)="$event.stopPropagation()">
        <div class="modal-icon success">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="#10B981" stroke-width="4"/>
            <path d="M14 24L21 31L34 18" stroke="#10B981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2 class="modal-title">Success!</h2>
        <p class="modal-message">Traffic data submitted successfully!</p>
        <button class="modal-button" (click)="closeSuccessModal()">OK</button>
      </div>
    </div>
  `,
  styles: [`




    /* Input Styles */
    .input-container {
      width: 100%;
      margin-bottom: 24px;
    }

    .number-input {
      width: 100%;
      background-color: var(--background);
      border: 2px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      font-size: 1.5rem;
      color: var(--text-primary);
      text-align: center;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .number-input::placeholder {
      color: var(--text-muted);
    }

    .number-input:focus,
    .number-input.input-focused {
      border-color: var(--border-focus);
    }

    .number-input::-webkit-outer-spin-button,
    .number-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Primary Button */
    .primary-button {
      width: 100%;
      padding: 16px;
      background-color: var(--primary);
      color: #FFFFFF;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--shadow-primary);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .primary-button:hover:not(:disabled) {
      background-color: var(--primary-hover);
      transform: translateY(-2px);
    }

    .primary-button:active:not(:disabled) {
      transform: scale(0.96);
    }

    .primary-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    /* Loading States */
    .loading-container {
      padding: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .loading-text {
      color: var(--text-secondary);
      margin-top: 16px;
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

    .spinner.large {
      width: 40px;
      height: 40px;
      border-width: 3px;
      border-color: rgba(59, 130, 246, 0.3);
      border-top-color: var(--primary);
    }

    /* Error States */
    .error-container {
      width: 100%;
      margin-bottom: 16px;
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

    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }

    .error-text {
      color: var(--error);
      text-align: center;
      margin-bottom: 16px;
    }

    /* Chart Container */
    .chart-container {
      width: 100%;
      overflow-x: auto;
      margin: 16px 0;
    }

    .chart {
      display: block;
      margin: 0 auto;
    }

    .chart-line {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: drawChart 1.5s ease-out forwards;
    }

    @keyframes drawChart {
      to {
        stroke-dashoffset: 0;
      }
    }

    .data-point {
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .data-point:hover,
    .data-point.active {
      r: 7;
    }

    /* Info Box */
    .info-box {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 12px;
      background-color: rgba(16, 185, 129, 0.1);
      border-radius: 12px;
      margin: 16px 0 24px;
      width: 100%;
    }

    .info-box p {
      color: var(--text-secondary);
      font-size: 0.8125rem;
      margin: 0;
      flex: 1;
    }

    /* Table Styles */
    .table-section {
      width: 100%;
    }

    .table-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 12px;
    }

    .table-header {
      display: flex;
      padding-bottom: 8px;
      margin-bottom: 8px;
      border-bottom: 1px solid var(--border);
    }

    .table-row {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid rgba(51, 65, 85, 0.5);
    }

    .table-col {
      flex: 1;
      color: var(--text-primary);
    }

    .table-col.center {
      text-align: center;
    }

    .table-col.right {
      text-align: right;
    }

    .table-header .table-col {
      color: var(--text-secondary);
      font-weight: 600;
    }

    .success-text {
      color: var(--success);
      font-weight: 700;
    }

    .staffing-content,
    .forecast-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* Prediction Section */
    .prediction-section {
      width: 100%;
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .prediction-result {
      margin-top: 24px;
      padding: 16px;
      background-color: rgba(59, 130, 246, 0.1);
      border-radius: 16px;
      width: 100%;
    }

    .prediction-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .prediction-label {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .prediction-subtitle {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: 0;
    }

    .prediction-value {
      margin-top: 4px;
    }

    .prediction-value .value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary);
    }

    .prediction-value .unit {
      font-size: 1rem;
      font-weight: 400;
      color: var(--text-muted);
      margin-left: 8px;
    }

    /* Bottom Navigation */
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: var(--surface);
      border-top: 1px solid var(--border);
      padding: 12px 8px;
      padding-bottom: calc(12px + env(safe-area-inset-bottom, 0));
      display: flex;
      justify-content: space-around;
      z-index: 100;
    }

    .nav-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      transition: transform 0.2s ease;
    }

    .nav-item:hover {
      transform: scale(1.05);
    }

    .nav-item:active {
      transform: scale(0.95);
    }

    .nav-icon-wrapper {
      position: relative;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-icon-bg {
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--primary);
      opacity: 0;
      transform: scale(0);
      transition: all 0.2s ease;
    }

    .nav-icon-bg.active {
      opacity: 0.1;
      transform: scale(1);
    }

    .nav-item:hover .nav-icon-bg {
      opacity: 0.1;
      transform: scale(1.1);
    }

    .nav-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 500;
      margin-top: 4px;
    }

    .nav-label.active {
      color: var(--primary);
      font-weight: 600;
    }

    /* Tooltip */
    .tooltip {
      position: fixed;
      background-color: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 8px 12px;
      z-index: 1000;
      pointer-events: none;
    }

    .tooltip-content {
      color: var(--text-primary);
      font-size: 0.875rem;
      font-weight: 500;
    }

    /* Modal */
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

    /* Responsive */
    @media (max-width: 600px) {
      .header {
        padding: 12px 16px;
      }

      .main-content {
        padding: 16px;
      }

      .card {
        padding: 24px 16px;
      }

      .card-title {
        font-size: 1.25rem;
      }
    }

    /* Table scrollable on mobile */
    .table-body {
      max-height: 300px;
      overflow-y: auto;
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  activeTab: TabId = 'input';
  customerCount = '';
  customerInputFocused = false;
  inputLoading = false;
  inputError = '';
  showSuccessModal = false;

  // Staffing State
  staffingData: StaffingResponse | null = null;
  staffingSchedule: StaffingScheduleItem[] = [];
  loadingStaffing = false;
  staffingError = '';

  // Forecast State
  forecastData: ForecastResponse | null = null;
  loadingForecast = false;
  forecastError = '';

  // Prediction State
  predictionResult = '';
  loadingPrediction = false;
  predictionError = '';

  // Chart State
  chartWidth = 600;
  staffingChartPoints: ChartPoint[] = [];
  staffingLinePath = '';
  staffingAreaPath = '';
  staffingXAxisLabels: string[] = [];
  staffingYAxisTicks: number[] = [];

  forecastChartPoints: ChartPoint[] = [];
  forecastLinePath = '';
  forecastAreaPath = '';
  forecastXAxisLabels: string[] = [];
  forecastYAxisTicks: number[] = [];

  // Tooltip
  tooltipVisible = false;
  tooltipContent = '';
  tooltipX = 0;
  tooltipY = 0;
  activeTooltip = -1;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Check authentication
    if (!this.apiService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Calculate chart width based on window
    this.updateChartWidth();
    window.addEventListener('resize', this.updateChartWidth.bind(this));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    window.removeEventListener('resize', this.updateChartWidth.bind(this));
  }

  private updateChartWidth(): void {
    const maxWidth = Math.min(window.innerWidth - 80, 600);
    this.chartWidth = Math.max(300, maxWidth);
  }

  setActiveTab(tab: TabId): void {
    this.activeTab = tab;
    this.tooltipVisible = false;

    if (tab === 'staffing' && !this.staffingData) {
      this.loadStaffing();
    } else if (tab === 'forecast' && !this.forecastData) {
      this.loadForecast();
    }
  }

  handleLogout(): void {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }

  handleEnterCustomerCount(): void {
    this.inputError = '';

    if (!this.customerCount.trim()) {
      this.inputError = 'Please enter a valid number';
      return;
    }

    const count = parseInt(this.customerCount, 10);
    if (isNaN(count) || count < 0) {
      this.inputError = 'Please enter a valid positive number';
      return;
    }

    this.inputLoading = true;

    const sub = this.apiService.submitSurvey(count).subscribe({
      next: () => {
        this.inputLoading = false;
        this.showSuccessModal = true;
        this.customerCount = '';
        
        // Reload staffing if on that tab
        if (this.activeTab === 'staffing') {
          this.loadStaffing();
        }
      },
      error: (error: ApiError) => {
        this.inputLoading = false;
        this.inputError = error.message;
      }
    });

    this.subscriptions.push(sub);
  }

  loadStaffing(): void {
    this.loadingStaffing = true;
    this.staffingError = '';

    const sub = this.apiService.getStaffing().subscribe({
      next: (data) => {
        this.loadingStaffing = false;
        this.staffingData = data;

        if (data.success && data.staffing_schedule) {
          this.staffingSchedule = data.staffing_schedule;
          this.processStaffingChartData(data.staffing_schedule);
        }
      },
      error: (error: ApiError) => {
        this.loadingStaffing = false;
        this.staffingError = error.message;
      }
    });

    this.subscriptions.push(sub);
  }

  loadForecast(): void {
    this.loadingForecast = true;
    this.forecastError = '';
    this.predictionResult = '';

    const sub = this.apiService.getForecast().subscribe({
      next: (data) => {
        this.loadingForecast = false;
        this.forecastData = data;

        if (data.success && data.predictions) {
          this.processForecastChartData(data.predictions);
        }
      },
      error: (error: ApiError) => {
        this.loadingForecast = false;
        this.forecastError = error.message;
      }
    });

    this.subscriptions.push(sub);
  }

  handlePredictFuture(): void {
    this.loadingPrediction = true;
    this.predictionError = '';
    this.predictionResult = '';

    const sub = this.apiService.getPrediction().subscribe({
      next: (data) => {
        this.loadingPrediction = false;

        if (data && data.predictions && data.predictions.length > 0) {
          const lastPred = data.predictions[data.predictions.length - 1];
          if (lastPred && lastPred.yhat !== undefined) {
            this.predictionResult = Math.round(lastPred.yhat).toString();
          } else {
            this.predictionError = 'Could not calculate prediction from model output.';
          }
        }
      },
      error: (error: ApiError) => {
        this.loadingPrediction = false;
        this.predictionError = error.message;
      }
    });

    this.subscriptions.push(sub);
  }

  private processStaffingChartData(schedule: StaffingScheduleItem[]): void {
    if (!schedule || schedule.length === 0) return;

    const values = schedule.map(item => item.recommended_staff);
    const maxValue = Math.max(...values, 1);
    const minValue = 0;

    // Generate Y-axis ticks
    const step = Math.ceil(maxValue / 4);
    this.staffingYAxisTicks = [0, step, step * 2, step * 3, step * 4];

    // Generate X-axis labels (show every 4th)
    this.staffingXAxisLabels = schedule
      .filter((_, i) => i % 4 === 0)
      .map(item => item.time);

    // Calculate chart points
    const chartPadding = 40;
    const chartHeight = 160;
    const chartEndX = this.chartWidth - 20;
    const usableWidth = chartEndX - chartPadding;

    this.staffingChartPoints = schedule.map((item, index) => {
      const x = chartPadding + (index / (schedule.length - 1)) * usableWidth;
      const y = 200 - ((item.recommended_staff - minValue) / (maxValue - minValue)) * chartHeight;
      return {
        x,
        y,
        value: item.recommended_staff,
        label: item.time
      };
    });

    // Generate path
    this.staffingLinePath = this.generateLinePath(this.staffingChartPoints);
    this.staffingAreaPath = this.generateAreaPath(this.staffingChartPoints, chartPadding, chartEndX);
  }

  private processForecastChartData(predictions: any[]): void {
    if (!predictions || predictions.length === 0) return;

    const values = predictions.map(p => p.y);
    const maxValue = Math.max(...values, 1);
    const minValue = Math.min(...values, 0);
    const range = maxValue - minValue || 1;

    // Generate Y-axis ticks
    const step = Math.ceil(range / 4);
    const baseValue = Math.floor(minValue / step) * step;
    this.forecastYAxisTicks = [0, 1, 2, 3, 4].map(i => baseValue + i * step);

    // Generate X-axis labels
    this.forecastXAxisLabels = predictions.map(p => {
      const date = new Date(p.ds);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }).filter((_, i) => i % Math.ceil(predictions.length / 6) === 0);

    // Calculate chart points
    const chartPadding = 40;
    const chartHeight = 160;
    const chartEndX = this.chartWidth - 20;
    const usableWidth = chartEndX - chartPadding;

    this.forecastChartPoints = predictions.map((item, index) => {
      const x = chartPadding + (index / (predictions.length - 1)) * usableWidth;
      const y = 200 - ((item.y - minValue) / range) * chartHeight;
      return {
        x,
        y: Math.max(40, Math.min(200, y)),
        value: item.y,
        label: new Date(item.ds).toLocaleDateString()
      };
    });

    this.forecastLinePath = this.generateLinePath(this.forecastChartPoints);
    this.forecastAreaPath = this.generateAreaPath(this.forecastChartPoints, chartPadding, chartEndX);
  }

  private generateLinePath(points: ChartPoint[]): string {
    if (points.length === 0) return '';

    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      // Bezier curve for smooth line
      const cpx1 = prev.x + (curr.x - prev.x) / 3;
      const cpy1 = prev.y;
      const cpx2 = prev.x + 2 * (curr.x - prev.x) / 3;
      const cpy2 = curr.y;
      
      path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
    }

    return path;
  }

  private generateAreaPath(points: ChartPoint[], startX: number, endX: number): string {
    if (points.length === 0) return '';

    let path = `M ${points[0].x} 200 L ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      const cpx1 = prev.x + (curr.x - prev.x) / 3;
      const cpy1 = prev.y;
      const cpx2 = prev.x + 2 * (curr.x - prev.x) / 3;
      const cpy2 = curr.y;
      
      path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
    }

    path += ` L ${points[points.length - 1].x} 200 Z`;

    return path;
  }

  getXAxisPosition(index: number, totalLabels: number): number {
    const chartPadding = 40;
    const chartEndX = this.chartWidth - 20;
    const usableWidth = chartEndX - chartPadding;
    return chartPadding + (index / (totalLabels - 1 || 1)) * usableWidth;
  }

  showStaffingTooltip(point: ChartPoint): void {
    this.tooltipContent = `${point.value} employees at ${point.label}`;
    this.tooltipX = point.x + 10;
    this.tooltipY = point.y - 30;
    this.tooltipVisible = true;

    setTimeout(() => {
      this.tooltipVisible = false;
    }, 2000);
  }

  showForecastTooltip(point: ChartPoint): void {
    this.tooltipContent = `${point.value} customers`;
    this.tooltipX = point.x + 10;
    this.tooltipY = point.y - 30;
    this.tooltipVisible = true;

    setTimeout(() => {
      this.tooltipVisible = false;
    }, 2000);
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }
}
