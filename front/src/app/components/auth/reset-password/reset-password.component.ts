import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { ResetPasswordRequest } from '../../../models/user.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  loading = false;
  submitted = false;
  resetSuccess = false;
  token: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });

    // Get token from route query param
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Token de réinitialisation manquant'
        });
        this.router.navigate(['/forgot-password']);
      }
    });
  }

  // Custom validator to check if passwords match
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  get f() { return this.resetPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    const resetPasswordRequest: ResetPasswordRequest = {
      token: this.token,
      password: this.f['password'].value
    };

    this.authService.resetPassword(resetPasswordRequest)
      .subscribe({
        next: response => {
          this.loading = false;
          this.resetSuccess = true;
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: response.message || 'Mot de passe réinitialisé avec succès'
          });
        },
        error: error => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: error.error?.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe'
          });
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
} 