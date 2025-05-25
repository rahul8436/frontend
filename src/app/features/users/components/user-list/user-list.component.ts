import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  template: `
    <div class="user-list-container">
      <div class="page-bg-animate page-bg-users"></div>
      <mat-card>
        <mat-card-header>
          <mat-card-title>Users</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="users" class="mat-elevation-z8">
            <ng-container matColumnDef="fullName">
              <th mat-header-cell *matHeaderCellDef>Full Name</th>
              <td mat-cell *matCellDef="let user">{{ user.full_name }}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let user">{{ user.email }}</td>
            </ng-container>

            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef>Role</th>
              <td mat-cell *matCellDef="let user">{{ user.role }}</td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>Created</th>
              <td mat-cell *matCellDef="let user">
                {{ user.created_at | date }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let user">
                <button
                  mat-icon-button
                  [routerLink]="['/users', user.id, 'edit']"
                >
                  <mat-icon>edit</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .page-bg-animate {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
        pointer-events: none;
        background: linear-gradient(270deg, #a084ee, #7b8cff, #a084ee, #7b8cff);
        background-size: 400% 400%;
        animation: gradientMoveUser 18s ease-in-out infinite;
        opacity: 0.7;
      }
      @keyframes gradientMoveUser {
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
      .user-list-container {
        position: relative;
        z-index: 1;
        padding: 20px;
      }
      mat-card {
        margin-bottom: 20px;
      }
      table {
        width: 100%;
      }
      .mat-column-actions {
        width: 80px;
        text-align: center;
      }
    `,
  ],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = [
    'fullName',
    'email',
    'role',
    'createdAt',
    'actions',
  ];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.apiService.get<User[]>('/api/users/').subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        // Handle error (show error message)
      },
    });
  }
}
