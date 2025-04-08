import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { ForgotPasswordRequest } from '../../../models/user.model';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  loading = false;
  submitted = false;
  emailSent = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.forgotPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    const forgotPasswordRequest: ForgotPasswordRequest = {
      email: this.f['email'].value
    };

    this.authService.forgotPassword(forgotPasswordRequest)
      .subscribe({
        next: response => {
          this.loading = false;
          this.emailSent = true;
          this.messageService.add({
            severity: 'success',
            summary: 'Email envoyé',
            detail: response.message || 'Un email de réinitialisation du mot de passe a été envoyé'
          });
        },
        error: error => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: error.error?.message || 'Une erreur est survenue'
          });
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
} 