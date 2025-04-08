import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { RegisterRequest, UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  
  roleOptions = [
    { label: 'Patient', value: UserRole.ROLE_PATIENT },
    { label: 'Pharmacien', value: UserRole.ROLE_PHARMACIEN }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Redirect to home if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      role: ['', [Validators.required]]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const registerRequest: RegisterRequest = {
      username: this.f['username'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      role: [this.f['role'].value]
    };

    this.authService.register(registerRequest)
      .subscribe({
        next: response => {
          this.messageService.add({
            severity: 'success',
            summary: 'Inscription réussie',
            detail: response.message || 'Votre compte a été créé avec succès'
          });
          this.router.navigate(['/login']);
        },
        error: error => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur d\'inscription',
            detail: error.error?.message || 'Une erreur est survenue lors de l\'inscription'
          });
        }
      });
  }
} 