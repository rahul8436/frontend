import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <!-- Top Navigation Bar -->
      <mat-toolbar class="toolbar">
        <button mat-icon-button (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="app-title"
          ><mat-icon class="app-title-icon">description</mat-icon> Document
          Management System</span
        >
        <span class="spacer"></span>
        <ng-container *ngIf="authService.currentUser$ | async as user">
          <button mat-button [matMenuTriggerFor]="userMenu">
            <mat-icon class="user-icon">person</mat-icon>
            {{ user.full_name }}
            <mat-icon>arrow_drop_down</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item (click)="onLogout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </ng-container>
      </mat-toolbar>

      <!-- Side Navigation -->
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav mode="side" opened class="sidenav">
          <mat-nav-list>
            <a
              mat-list-item
              routerLink="/documents"
              routerLinkActive="active"
              class="drawer-documents"
            >
              <mat-icon class="drawer-icon">insert_drive_file</mat-icon>
              <span class="drawer-text">Documents</span>
            </a>
            <a
              mat-list-item
              routerLink="/ingestions"
              routerLinkActive="active"
              class="drawer-ingestions"
            >
              <mat-icon class="drawer-icon">cloud_done</mat-icon>
              <span class="drawer-text">Ingestions</span>
            </a>
            <a
              mat-list-item
              routerLink="/users"
              routerLinkActive="active"
              *ngIf="isAdmin()"
              class="drawer-users"
            >
              <mat-icon class="drawer-icon">supervisor_account</mat-icon>
              <span class="drawer-text">Users</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <!-- Main Content -->
        <mat-sidenav-content class="content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [
    `
      .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
      }

      .toolbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 2;
        background: #fff;
        color: #222;
        box-shadow: 0 2px 8px 0 rgba(80, 80, 160, 0.08);
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        display: flex;
        align-items: center;
        min-height: 64px;
        padding: 0 32px 0 16px;
      }

      .app-title {
        margin-left: 8px;
        font-size: 1.45rem;
        font-weight: 700;
        letter-spacing: 0.01em;
        color: #2d2d4d;
        display: flex;
        align-items: center;
      }

      .app-title-icon {
        font-size: 2rem;
        margin-right: 8px;
        color: #2d2d4d;
        vertical-align: middle;
      }

      .spacer {
        flex: 1 1 auto;
      }

      .toolbar button[mat-icon-button] {
        margin-right: 0;
        display: flex;
        align-items: center;
      }

      .toolbar .mat-button,
      .toolbar [mat-menu-trigger-for] {
        display: flex;
        align-items: center;
        height: 100%;
      }

      .sidenav-container {
        flex: 1;
        margin-top: 64px; /* Height of toolbar */
      }

      .sidenav {
        width: 250px;
        background: linear-gradient(135deg, #7b8cff 0%, #a084ee 100%);
        color: #fff;
      }

      .sidenav mat-nav-list {
        padding-top: 16px;
      }

      .sidenav mat-nav-list a {
        display: flex;
        align-items: center;
        padding: 0 16px;
        height: 48px;
        color: #222;
        opacity: 1;
        font-weight: 500;
        text-decoration: none;
      }

      .sidenav mat-nav-list a mat-icon {
        margin-right: 16px;
        color: #fff;
      }

      .sidenav mat-nav-list a.active {
        background: rgba(255, 255, 255, 0.18);
        color: #fff;
        font-weight: 700;
        border-radius: 12px;
        box-shadow: 0 2px 12px 0 rgba(80, 80, 160, 0.08);
      }

      .sidenav mat-nav-list a.active mat-icon {
        color: #fff;
      }

      .drawer-icon {
        color: #fff;
        font-size: 2rem;
        margin-right: 16px;
        filter: drop-shadow(0 2px 8px rgba(80, 80, 160, 0.1));
      }
      .drawer-text {
        color: #fff;
        font-size: 1.18rem;
        font-weight: 600;
        letter-spacing: 0.01em;
        text-shadow: 0 2px 8px rgba(80, 80, 160, 0.1);
        margin-left: 2px;
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      }

      .user-icon {
        color: #2d2d4d;
        font-size: 1.6rem;
        margin-right: 4px;
        vertical-align: middle;
      }

      .content {
        min-height: 100vh;
        background: linear-gradient(270deg, #7b8cff, #a084ee, #7b8cff, #a084ee);
        background-size: 400% 400%;
        animation: gradientMove 18s ease-in-out infinite;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      @keyframes gradientMove {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

      @media (max-width: 600px) {
        .sidenav {
          width: 200px;
        }
      }

      /* Animations for drawer icons */
      .drawer-documents:hover .drawer-icon,
      .drawer-documents.active .drawer-icon {
        animation: bounceDoc 0.7s;
      }
      @keyframes bounceDoc {
        0%,
        100% {
          transform: translateY(0);
        }
        30% {
          transform: translateY(-8px);
        }
        50% {
          transform: translateY(0);
        }
        70% {
          transform: translateY(-4px);
        }
      }
      .drawer-ingestions:hover .drawer-icon,
      .drawer-ingestions.active .drawer-icon {
        animation: moveIngest 0.7s;
      }
      @keyframes moveIngest {
        0%,
        100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(0);
        }
      }
      .drawer-users:hover .drawer-icon,
      .drawer-users.active .drawer-icon {
        animation: pulseUser 0.7s;
      }
      @keyframes pulseUser {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.18);
        }
      }
    `,
  ],
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  onLogout(): void {
    this.authService.logout();
  }

  isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }
}
