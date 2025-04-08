import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      return true;
    }

    this.messageService.add({
      severity: 'error',
      summary: 'Accès refusé',
      detail: 'Vous n\'avez pas les droits d\'accès à cette page'
    });
    
    this.router.navigate(['/medicaments']);
    return false;
  }
} 