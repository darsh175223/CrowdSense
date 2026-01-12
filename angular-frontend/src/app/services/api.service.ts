import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map, retry } from 'rxjs/operators';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
}

export interface SurveySubmission {
  rating: number;
}

export interface StaffingScheduleItem {
  time: string;
  predicted_pedestrians: number;
  recommended_staff: number;
}

export interface StaffingResponse {
  success: boolean;
  day: string;
  staffing_schedule: StaffingScheduleItem[];
}

export interface ForecastPrediction {
  ds: string;
  y: number;
}

export interface ForecastResponse {
  success: boolean;
  predictions: ForecastPrediction[];
}

export interface PredictionItem {
  ds: string;
  yhat: number;
  yhat_lower: number;
  yhat_upper: number;
}

export interface PredictionResponse {
  success: boolean;
  predictions: PredictionItem[];
}

export interface ApiError {
  message: string;
  status?: number;
  originalError?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly BASE_URL = 'http://localhost:8084/api';
  private http = inject(HttpClient);
  
  private tokenSubject = new BehaviorSubject<string | null>(this.getStoredToken());
  public token$ = this.tokenSubject.asObservable();

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    const token = this.tokenSubject.value;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';
    let status = error.status;

    if (error.status === 0) {
      // Network error or server unreachable
      errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
    } else if (error.status === 401) {
      errorMessage = 'Your session has expired. Please log in again.';
      this.logout();
    } else if (error.status === 403) {
      errorMessage = 'You do not have permission to perform this action.';
    } else if (error.status === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (error.status === 500) {
      errorMessage = 'A server error occurred. Please try again later.';
    } else if (error.error) {
      // Parse server error response
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error.Message) {
        errorMessage = error.error.Message;
      } else if (error.error.error) {
        errorMessage = error.error.error;
      }
    }

    console.error('API Error:', { status, message: errorMessage, originalError: error });

    const apiError: ApiError = {
      message: errorMessage,
      status: status,
      originalError: error
    };

    return throwError(() => apiError);
  }

  // Authentication Methods
  register(userData: RegisterData): Observable<AuthResponse> {
    console.log('Sending register request to:', `${this.BASE_URL}/Auth/register`);
    return this.http.post<AuthResponse>(
      `${this.BASE_URL}/Auth/register`,
      userData,
      { headers: this.getHeaders() }
    ).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  login(credentials: LoginData): Observable<AuthResponse> {
    console.log('Sending login request to:', `${this.BASE_URL}/Auth/login`);
    return this.http.post<AuthResponse>(
      `${this.BASE_URL}/Auth/login`,
      credentials,
      { headers: this.getHeaders() }
    ).pipe(
      tap((response) => {
        if (response.token) {
          this.saveToken(response.token);
        }
      }),
      catchError((error) => this.handleError(error))
    );
  }

  saveToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('authToken', token);
      this.tokenSubject.next(token);
    }
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('authToken');
      this.tokenSubject.next(null);
    }
  }

  // Survey Methods
  submitSurvey(rating: number): Observable<any> {
    console.log('Sending survey submit request to:', `${this.BASE_URL}/Survey/submit`, 'with rating:', rating);
    return this.http.post(
      `${this.BASE_URL}/Survey/submit`,
      { rating },
      { headers: this.getHeaders() }
    ).pipe(
      retry({ count: 1, delay: 1000 }),
      catchError((error) => this.handleError(error))
    );
  }

  // Forecast Methods
  getForecast(): Observable<ForecastResponse> {
    console.log('Fetching forecast from:', `${this.BASE_URL}/Survey/forecast`);
    return this.http.get<ForecastResponse>(
      `${this.BASE_URL}/Survey/forecast`,
      { headers: this.getHeaders() }
    ).pipe(
      retry({ count: 2, delay: 1000 }),
      catchError((error) => this.handleError(error))
    );
  }

  // Staffing Methods
  getStaffing(): Observable<StaffingResponse> {
    console.log('Fetching staffing optimization from:', `${this.BASE_URL}/Survey/staffing`);
    return this.http.get<StaffingResponse>(
      `${this.BASE_URL}/Survey/staffing`,
      { headers: this.getHeaders() }
    ).pipe(
      retry({ count: 2, delay: 1000 }),
      catchError((error) => this.handleError(error))
    );
  }

  // Prediction Methods
  getPrediction(): Observable<PredictionResponse> {
    console.log('Fetching prediction from:', `${this.BASE_URL}/Survey/predict-future`);
    return this.http.get<PredictionResponse>(
      `${this.BASE_URL}/Survey/predict-future`,
      { headers: this.getHeaders() }
    ).pipe(
      retry({ count: 1, delay: 1000 }),
      catchError((error) => this.handleError(error))
    );
  }
}
