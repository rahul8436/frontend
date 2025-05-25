import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { Ingestion, IngestionStatus } from '../../../../core/models/ingestion.model';
import { MatTableDataSource } from '@angular/material/table';
import { Document } from '../../../../core/models/document.model';

@Component({
  selector: 'app-ingestion-view',
  template: `
    <div class="view-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Ingestion Details</mat-card-title>
          <div class="header-actions">
            <button mat-button routerLink="/ingestions">
              <mat-icon>arrow_back</mat-icon>
              Back to List
            </button>
          </div>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="ingestion" class="ingestion-details">
            <div class="detail-row">
              <span class="label">Ingestion ID:</span>
              <span class="value">{{ingestion.id}}</span>
            </div>
            <div class="detail-row">
              <span class="label">Document ID:</span>
              <span class="value">{{ingestion.document_id}}</span>
            </div>
            <div class="detail-row">
              <span class="label">Status:</span>
              <span class="value" [class]="'status-' + ingestion.status.toLowerCase()">
                {{ingestion.status}}
              </span>
            </div>
            <div class="detail-row">
              <span class="label">Started At:</span>
              <span class="value">{{ingestion.started_at | date:'medium'}}</span>
            </div>
            <div class="detail-row">
              <span class="label">Completed At:</span>
              <span class="value">{{ingestion.completed_at ? (ingestion.completed_at | date:'medium') : '-'}}</span>
            </div>
            <div *ngIf="ingestion.error_message" class="error-section">
              <h3>Error Details</h3>
              <p class="error-message">{{ingestion.error_message}}</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .view-container {
      padding: 20px;
    }
    mat-card {
      margin-bottom: 20px;
    }
    .header-actions {
      margin-left: auto;
    }
    mat-card-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    .ingestion-details {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .detail-row {
      display: flex;
      gap: 16px;
    }
    .label {
      font-weight: 500;
      min-width: 120px;
    }
    .value {
      color: #666;
    }
    .status-pending {
      color: #f57c00;
    }
    .status-processing {
      color: #1976d2;
    }
    .status-completed {
      color: #388e3c;
    }
    .status-failed {
      color: #d32f2f;
    }
    .progress-section {
      margin-top: 20px;
    }
    .progress-text {
      margin-top: 8px;
      color: #666;
    }
    .error-section {
      margin-top: 20px;
      padding: 16px;
      background-color: #ffebee;
      border-radius: 4px;
    }
    .error-message {
      color: #d32f2f;
      margin: 8px 0 0;
    }
    .documents-section {
      margin-top: 20px;
    }
    table {
      width: 100%;
      margin-top: 16px;
    }
  `]
})
export class IngestionViewComponent implements OnInit {
  ingestion: Ingestion | null = null;
  documentColumns: string[] = ['title', 'fileType', 'createdAt'];
  documentsDataSource = new MatTableDataSource<Document>([]);

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const ingestionId = this.route.snapshot.params['id'];
    this.loadIngestion(ingestionId);
  }

  loadIngestion(id: number): void {
    this.apiService.get<Ingestion>(`/api/ingestion/${id}`).subscribe({
      next: (ingestion) => {
        this.ingestion = ingestion;
        // If ingestion is still processing, poll for updates
        if (ingestion.status === IngestionStatus.PROCESSING) {
          this.pollIngestionStatus(id);
        }
      },
      error: (error) => {
        console.error('Error loading ingestion:', error);
        // Handle error (show error message)
      }
    });
  }

  private pollIngestionStatus(id: number): void {
    const pollInterval = setInterval(() => {
      this.apiService.get<Ingestion>(`/api/ingestion/${id}`).subscribe({
        next: (ingestion) => {
          this.ingestion = ingestion;
          if (ingestion.status !== IngestionStatus.PROCESSING) {
            clearInterval(pollInterval);
          }
        },
        error: (error) => {
          console.error('Error polling ingestion status:', error);
          clearInterval(pollInterval);
        }
      });
    }, 5000); // Poll every 5 seconds
  }
} 