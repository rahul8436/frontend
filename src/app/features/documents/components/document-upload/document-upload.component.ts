import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentService } from '../../../../core/services/document.service';

@Component({
  selector: 'app-document-upload',
  template: `
    <div class="upload-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Upload Document</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="uploadForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" required>
              <mat-error *ngIf="uploadForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>File Type</mat-label>
              <input matInput formControlName="fileType" required>
              <mat-error *ngIf="uploadForm.get('fileType')?.hasError('required')">
                File type is required
              </mat-error>
            </mat-form-field>

            <div class="file-upload">
              <input type="file" (change)="onFileSelected($event)" #fileInput>
              <button type="button" mat-stroked-button (click)="fileInput.click()">
                Select File
              </button>
              <span *ngIf="selectedFile">{{selectedFile.name}}</span>
            </div>

            <div class="upload-progress" *ngIf="uploadProgress > 0">
              <mat-progress-bar mode="determinate" [value]="uploadProgress"></mat-progress-bar>
              <span>{{uploadProgress}}%</span>
            </div>

            <div class="form-actions">
              <button mat-button type="button" routerLink="/documents">Cancel</button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="uploadForm.invalid || !selectedFile">
                Upload
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .upload-container {
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
    .file-upload {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    input[type="file"] {
      display: none;
    }
    .upload-progress {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 20px;
    }
  `]
})
export class DocumentUploadComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  uploadProgress = 0;

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      fileType: ['', Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.uploadForm.valid && this.selectedFile) {
      const { title, description, fileType } = this.uploadForm.value;
      
      this.documentService.uploadDocument(
        this.selectedFile,
        { title, description, file_type: fileType }
      ).subscribe({
        next: () => {
          this.router.navigate(['/documents']);
        },
        error: (error) => {
          console.error('Error uploading document:', error);
          // Handle error (show error message)
        }
      });
    }
  }
} 