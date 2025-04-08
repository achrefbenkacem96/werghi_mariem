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
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private messageService: MessageService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Auto logout if 401 response returned from api
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
          this.messageService.add({
            severity: 'error',
            summary: 'Session expirée',
            detail: 'Veuillez vous reconnecter'
          });
        } else if (error.status === 403) {
          this.messageService.add({
            severity: 'error',
            summary: 'Accès refusé',
            detail: 'Vous n\'avez pas les permissions nécessaires'
          });
        } else if (error.status === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur de connexion',
            detail: 'Le serveur n\'est pas accessible'
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: error.error?.message || 'Une erreur est survenue'
          });
        }
        
        return throwError(() => error);
      })
    );
  }
} 