import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { 
  User, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  ForgotPasswordRequest, 
  ResetPasswordRequest 
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public authStatus = new BehaviorSubject<boolean>(false);
  
  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) { 
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.authStatus.next(this.isAuthenticated());
  }
  
  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, loginRequest)
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.token);
          const user: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            roles: response.roles
          };
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.authStatus.next(true);
        })
      );
  }
  
  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, registerRequest);
  }
  
  forgotPassword(forgotPasswordRequest: ForgotPasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, forgotPasswordRequest);
  }
  
  resetPassword(resetPasswordRequest: ResetPasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, resetPasswordRequest);
  }
  
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.authStatus.next(false);
  }
  
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!(token && !this.jwtHelper.isTokenExpired(token));
  }
  
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user !== null && user.roles && user.roles.includes('ROLE_ADMIN');
  }
  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  }
} 