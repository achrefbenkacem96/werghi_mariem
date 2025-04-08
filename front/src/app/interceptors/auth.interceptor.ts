import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the token from local storage
    const token = localStorage.getItem('accessToken');
    
    // If we have a token, add it to the request headers
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Handle the request and catch any errors
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // If the token is invalid or expired, clear local storage and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          this.messageService.add({
            severity: 'error',
            summary: 'Session expirée',
            detail: 'Votre session a expiré. Veuillez vous reconnecter.'
          });
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }
} 