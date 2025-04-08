import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    this.messageService.add({
      severity: 'error',
      summary: 'Accès refusé',
      detail: 'Vous devez être connecté pour accéder à cette page'
    });
    
    this.router.navigate(['/login']);
    return false;
  }
} 