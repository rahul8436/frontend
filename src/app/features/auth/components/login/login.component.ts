import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-bg">
      <div class="bubble bubble1"></div>
      <div class="bubble bubble2"></div>
      <div class="bubble bubble3"></div>
      <div class="bubble bubble4"></div>
      <div class="bubble bubble5"></div>
      <div class="auth-card">
        <h2 class="auth-title">Login</h2>
        <div class="auth-underline"></div>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <input
            class="auth-input"
            placeholder="Email*"
            formControlName="email"
            type="email"
            required
          />
          <div
            class="auth-error"
            *ngIf="
              loginForm.get('email')?.invalid && loginForm.get('email')?.touched
            "
          >
            <span *ngIf="loginForm.get('email')?.hasError('required')"
              >Email is required</span
            >
            <span *ngIf="loginForm.get('email')?.hasError('email')"
              >Please enter a valid email</span
            >
          </div>
          <input
            class="auth-input"
            placeholder="Password*"
            formControlName="password"
            type="password"
            required
          />
          <div
            class="auth-error"
            *ngIf="
              loginForm.get('password')?.invalid &&
              loginForm.get('password')?.touched
            "
          >
            <span *ngIf="loginForm.get('password')?.hasError('required')"
              >Password is required</span
            >
          </div>
          <button class="auth-btn" type="submit" [disabled]="loginForm.invalid">
            Login
          </button>
        </form>
        <a class="auth-link" routerLink="/auth/register">Create Account</a>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-bg {
        min-height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #7b8cff 0%, #a084ee 100%);
        position: relative;
        overflow: hidden;
      }
      /* Animated floating bubbles for background */
      .bubble {
        position: absolute;
        border-radius: 50%;
        opacity: 0.18;
        animation: float 12s infinite linear;
        pointer-events: none;
      }
      .bubble1 {
        width: 120px;
        height: 120px;
        left: 10vw;
        top: 60vh;
        background: #fff;
        animation-delay: 0s;
      }
      .bubble2 {
        width: 80px;
        height: 80px;
        left: 70vw;
        top: 20vh;
        background: #fff;
        animation-delay: 2s;
      }
      .bubble3 {
        width: 60px;
        height: 60px;
        left: 40vw;
        top: 80vh;
        background: #fff;
        animation-delay: 4s;
      }
      .bubble4 {
        width: 100px;
        height: 100px;
        left: 80vw;
        top: 70vh;
        background: #fff;
        animation-delay: 6s;
      }
      .bubble5 {
        width: 90px;
        height: 90px;
        left: 20vw;
        top: 10vh;
        background: #fff;
        animation-delay: 8s;
      }
      @keyframes float {
        0% {
          transform: translateY(0) scale(1);
          opacity: 0.18;
        }
        50% {
          transform: translateY(-40px) scale(1.1);
          opacity: 0.22;
        }
        100% {
          transform: translateY(0) scale(1);
          opacity: 0.18;
        }
      }
      .auth-card {
        background: #fff;
        border-radius: 24px;
        box-shadow: 0 8px 32px 0 rgba(80, 80, 160, 0.15);
        padding: 40px 32px 32px 32px;
        min-width: 320px;
        max-width: 380px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .auth-title {
        font-size: 2.2rem;
        font-weight: 700;
        margin-bottom: 0.2em;
        color: #2d2d4d;
        text-align: center;
      }
      .auth-underline {
        width: 60px;
        height: 4px;
        background: linear-gradient(90deg, #7b8cff 0%, #a084ee 100%);
        border-radius: 2px;
        margin-bottom: 24px;
      }
      form {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }
      .auth-input {
        width: 100%;
        padding: 12px 16px;
        border: 1.5px solid #e0e0f0;
        border-radius: 8px;
        font-size: 1rem;
        background: #f8f8ff;
        outline: none;
        transition: border 0.2s, box-shadow 0.2s;
        margin-bottom: 0;
        box-sizing: border-box;
        display: block;
      }
      .auth-input:focus {
        border: 1.5px solid #a084ee;
        background: #fff;
        box-shadow: 0 0 0 2px #a084ee22;
      }
      .auth-error {
        color: #d32f2f;
        font-size: 0.92em;
        margin-top: -12px;
        margin-bottom: 4px;
      }
      .auth-btn {
        width: 100%;
        padding: 12px 0;
        border: none;
        border-radius: 12px;
        background: linear-gradient(90deg, #7b8cff 0%, #a084ee 100%);
        color: #fff;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        margin-top: 8px;
        transition: background 0.2s;
      }
      .auth-btn:disabled {
        background: #bdbddd;
        cursor: not-allowed;
      }
      .auth-link {
        display: block;
        margin-top: 18px;
        color: #5a6cff;
        text-align: center;
        text-decoration: none;
        font-size: 1rem;
        font-weight: 500;
        transition: color 0.2s;
      }
      .auth-link:hover {
        color: #a084ee;
        text-decoration: underline;
      }
      @media (max-width: 600px) {
        .auth-bg {
          padding: 16px;
        }
        .auth-card {
          min-width: 0;
          max-width: 100vw;
          padding: 24px 8px 16px 8px;
        }
        .auth-title {
          font-size: 1.5rem;
        }
        .auth-underline {
          width: 40px;
          height: 3px;
          margin-bottom: 16px;
        }
        .auth-input {
          font-size: 0.98rem;
          padding: 10px 10px;
        }
        .auth-btn {
          font-size: 1rem;
          padding: 10px 0;
        }
      }
    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/documents']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          // Handle login error (show error message)
        },
      });
    }
  }
}
