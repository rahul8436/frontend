import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../../../../core/services/document.service';
import { Document } from '../../../../core/models/document.model';

@Component({
  selector: 'app-document-edit',
  template: `
    <div class="edit-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Edit Document</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="editForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" required>
              <mat-error *ngIf="editForm.get('title')?.hasError('required')">
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
              <mat-error *ngIf="editForm.get('fileType')?.hasError('required')">
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

            <div class="form-actions">
              <button mat-button type="button" routerLink="/documents">Cancel</button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="editForm.invalid || !editForm.dirty">
                Save Changes
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .edit-container {
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
  `]
})
export class DocumentEditComponent implements OnInit {
  editForm: FormGroup;
  documentId: number;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.documentId = this.route.snapshot.params['id'];
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      fileType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDocument();
  }

  loadDocument(): void {
    this.documentService.getDocument(this.documentId).subscribe({
      next: (document) => {
        this.editForm.patchValue({
          title: document.title,
          description: document.description,
          fileType: document.file_type
        });
      },
      error: (error) => {
        console.error('Error loading document:', error);
        // Handle error (show error message)
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.editForm.valid && this.editForm.dirty) {
      const { title, description, fileType } = this.editForm.value;
      this.documentService.updateDocument(this.documentId, {
        title,
        description,
        file_type: fileType
      }, this.selectedFile).subscribe({
        next: () => {
          this.router.navigate(['/documents']);
        },
        error: (error) => {
          console.error('Error updating document:', error);
          // Handle error (show error message)
        }
      });
    }
  }
} 