import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Gestion des Médicaments';
  items: MenuItem[] = [];
  
  constructor(private authService: AuthService, private router: Router) { }
  
  ngOnInit() {
    this.updateMenu();
    
    // Subscribe to auth status changes to update the menu
    this.authService.authStatus.subscribe(() => {
      this.updateMenu();
    });
  }
  
  updateMenu() {
    const isLoggedIn = this.authService.isAuthenticated();
    const isAdmin = this.authService.isAdmin();
    
    this.items = [
      {
        label: 'Accueil',
        icon: 'pi pi-home',
        routerLink: ['/']
      }
    ];
    
    if (isLoggedIn) {
      this.items.push(
        {
          label: 'Médicaments',
          icon: 'pi pi-list',
          routerLink: ['/medicaments']
        }
      );
      
      if (isAdmin) {
        this.items.push(
          {
            label: 'Administration',
            icon: 'pi pi-cog',
            items: [
              {
                label: 'Médicaments expirés',
                icon: 'pi pi-calendar-times',
                routerLink: ['/medicaments/expired']
              },
              {
                label: 'Stock bas',
                icon: 'pi pi-exclamation-triangle',
                routerLink: ['/medicaments/low-stock']
              }
            ]
          }
        );
      }
      
      this.items.push(
        {
          label: 'Déconnexion',
          icon: 'pi pi-sign-out',
          command: () => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      );
    } else {
      this.items.push(
        {
          label: 'Connexion',
          icon: 'pi pi-sign-in',
          routerLink: ['/login']
        },
        {
          label: 'Inscription',
          icon: 'pi pi-user-plus',
          routerLink: ['/register']
        }
      );
    }
  }
} 