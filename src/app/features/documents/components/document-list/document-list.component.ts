import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from '../../../../core/services/document.service';
import { Document } from '../../../../core/models/document.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-document-list',
  template: `
    <div class="document-list-container">
      <div class="page-bg-animate page-bg-documents"></div>
      <mat-card>
        <mat-card-header>
          <mat-card-title>Documents</mat-card-title>
          <div class="spacer"></div>
          <button
            mat-raised-button
            color="primary"
            routerLink="/documents/upload"
          >
            Upload Document
          </button>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="documents" class="mat-elevation-z8">
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let document">{{ document.title }}</td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let document">
                {{ document.description }}
              </td>
            </ng-container>

            <ng-container matColumnDef="fileType">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let document">
                {{ document.file_type }}
              </td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>Created</th>
              <td mat-cell *matCellDef="let document">
                {{ document.created_at | date }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let document">
                <button
                  mat-icon-button
                  [routerLink]="['/documents', document.id, 'edit']"
                  *ngIf="canEdit()"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="deleteDocument(document.id)"
                  *ngIf="canDelete()"
                >
                  <mat-icon>delete</mat-icon>
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
        background: linear-gradient(270deg, #7b8cff, #a084ee, #7b8cff, #a084ee);
        background-size: 400% 400%;
        animation: gradientMoveDoc 18s ease-in-out infinite;
        opacity: 0.7;
      }
      @keyframes gradientMoveDoc {
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
      .document-list-container {
        position: relative;
        z-index: 1;
        padding: 20px;
      }
      mat-card {
        margin-bottom: 20px;
      }
      mat-card-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }
      .spacer {
        flex: 1 1 auto;
      }
      table {
        width: 100%;
      }
      .mat-column-actions {
        width: 120px;
        text-align: center;
      }
    `,
  ],
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  displayedColumns: string[] = [
    'title',
    'description',
    'fileType',
    'createdAt',
    'actions',
  ];

  constructor(
    private documentService: DocumentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.documentService.getDocuments().subscribe({
      next: (documents) => {
        this.documents = documents;
      },
      error: (error) => {
        console.error('Error loading documents:', error);
        // Handle error (show error message)
      },
    });
  }

  deleteDocument(id: number): void {
    if (confirm('Are you sure you want to delete this document?')) {
      this.documentService.deleteDocument(id).subscribe({
        next: () => {
          this.loadDocuments();
        },
        error: (error) => {
          console.error('Error deleting document:', error);
          // Handle error (show error message)
        },
      });
    }
  }

  canEdit(): boolean {
    return (
      this.authService.hasRole('admin') || this.authService.hasRole('editor')
    );
  }

  canDelete(): boolean {
    return this.authService.hasRole('admin');
  }
}
