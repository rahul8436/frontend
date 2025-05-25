import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-ingestion-create',
  template: `
    <div class="create-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Create Ingestion</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="createForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" required>
              <mat-error *ngIf="createForm.get('name')?.hasError('required')">
                Name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Source Type</mat-label>
              <mat-select formControlName="sourceType" required>
                <mat-option value="file">File</mat-option>
                <mat-option value="url">URL</mat-option>
                <mat-option value="api">API</mat-option>
              </mat-select>
              <mat-error *ngIf="createForm.get('sourceType')?.hasError('required')">
                Source type is required
              </mat-error>
            </mat-form-field>

            <div *ngIf="createForm.get('sourceType')?.value === 'file'">
              <input type="file" (change)="onFileSelected($event)" #fileInput>
              <div *ngIf="selectedFile" class="selected-file">
                Selected file: {{selectedFile.name}}
              </div>
            </div>

            <div *ngIf="createForm.get('sourceType')?.value === 'url'">
              <mat-form-field appearance="outline">
                <mat-label>URL</mat-label>
                <input matInput formControlName="sourceUrl" type="url">
                <mat-error *ngIf="createForm.get('sourceUrl')?.hasError('url')">
                  Please enter a valid URL
                </mat-error>
              </mat-form-field>
            </div>

            <div *ngIf="createForm.get('sourceType')?.value === 'api'">
              <mat-form-field appearance="outline">
                <mat-label>API Endpoint</mat-label>
                <input matInput formControlName="apiEndpoint">
                <mat-error *ngIf="createForm.get('apiEndpoint')?.hasError('required')">
                  API endpoint is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" routerLink="/ingestions">Cancel</button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="createForm.invalid || isSubmitting">
                Create Ingestion
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .create-container {
      padding: 20px;
    }
    mat-card {
      max-width: 600px;
      margin: 0 auto;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    mat-form-field {
      width: 100%;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 20px;
    }
    .selected-file {
      margin-top: 8px;
      color: #666;
    }
  `]
})
export class IngestionCreateComponent {
  createForm: FormGroup;
  selectedFile: File | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      sourceType: ['', Validators.required],
      sourceUrl: [''],
      apiEndpoint: ['']
    });

    // Add validators based on source type
    this.createForm.get('sourceType')?.valueChanges.subscribe(type => {
      const sourceUrlControl = this.createForm.get('sourceUrl');
      const apiEndpointControl = this.createForm.get('apiEndpoint');

      if (type === 'url') {
        sourceUrlControl?.setValidators([Validators.required, Validators.pattern('https?://.+')]);
        apiEndpointControl?.clearValidators();
      } else if (type === 'api') {
        apiEndpointControl?.setValidators([Validators.required]);
        sourceUrlControl?.clearValidators();
      } else {
        sourceUrlControl?.clearValidators();
        apiEndpointControl?.clearValidators();
      }

      sourceUrlControl?.updateValueAndValidity();
      apiEndpointControl?.updateValueAndValidity();
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.createForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formData = new FormData();

      // Add form fields
      Object.keys(this.createForm.value).forEach(key => {
        if (this.createForm.value[key]) {
          formData.append(key, this.createForm.value[key]);
        }
      });

      // Add file if selected
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      this.apiService.post('/api/ingestion/trigger', formData).subscribe({
        next: () => {
          this.router.navigate(['/ingestions']);
        },
        error: (error) => {
          console.error('Error creating ingestion:', error);
          this.isSubmitting = false;
          // Handle error (show error message)
        }
      });
    }
  }
} 