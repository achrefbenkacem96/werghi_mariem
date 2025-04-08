import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

// Auth components
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';

// Medicament components
import { MedicamentListComponent } from './components/medicaments/medicament-list/medicament-list.component';
import { ExpiredMedicamentsComponent } from './components/medicaments/expired-medicaments/expired-medicaments.component';
import { LowStockMedicamentsComponent } from './components/medicaments/low-stock-medicaments/low-stock-medicaments.component';

const routes: Routes = [
  // Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // Medicament routes - protected by auth
  { path: 'medicaments', component: MedicamentListComponent, canActivate: [AuthGuard] },
  { path: 'medicaments/expired', component: ExpiredMedicamentsComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'medicaments/low-stock', component: LowStockMedicamentsComponent, canActivate: [AuthGuard, AdminGuard] },

  // Default routes
  { path: '', redirectTo: '/medicaments', pathMatch: 'full' },
  { path: '**', redirectTo: '/medicaments' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 