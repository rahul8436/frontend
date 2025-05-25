import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { UserRole } from '../models/user.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private http: HttpClient
  ) {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      this.loadCurrentUser();
    }
  }

  login(email: string, password: string): Observable<{ access_token: string }> {
    const body = new HttpParams()
      .set('username', email)
      .set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<{ access_token: string }>(
      `${environment.apiUrl}/api/auth/token`,
      body.toString(),
      { headers }
    ).pipe(
      tap({
        next: (response) => {
          console.log('Login API response:', response);
          localStorage.setItem('token', response.access_token);
          console.log('Token stored:', localStorage.getItem('token'));
          this.loadCurrentUser();
        },
        error: (err) => {
          console.error('Login API error:', err);
        }
      })
    );
  }

  register(fullName: string, email: string, password: string, role: UserRole): Observable<User> {
    return this.apiService.post<User>('/api/auth/register', {
      full_name: fullName,
      email: email,
      password: password,
      role: role,
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private loadCurrentUser(): void {
    this.apiService.get<User>('/api/auth/me').subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
      },
      error: () => {
        this.logout();
      }
    });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }
} 