import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentUploadComponent } from './document-upload.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DocumentService } from '../../../../core/services/document.service';
import { of } from 'rxjs';
import { Document } from '../../../../core/models/document.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DocumentUploadComponent', () => {
  let component: DocumentUploadComponent;
  let fixture: ComponentFixture<DocumentUploadComponent>;
  let documentService: jasmine.SpyObj<DocumentService>;

  const dummyDoc: Document = {
    id: 1,
    title: 'Test',
    description: '',
    file_type: 'pdf',
    file_path: '',
    created_by: 1,
    created_at: '',
    updated_at: ''
  };

  beforeEach(async () => {
    const docServiceSpy = jasmine.createSpyObj('DocumentService', ['uploadDocument']);
    await TestBed.configureTestingModule({
      declarations: [DocumentUploadComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [{ provide: DocumentService, useValue: docServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentUploadComponent);
    component = fixture.componentInstance;
    documentService = TestBed.inject(DocumentService) as jasmine.SpyObj<DocumentService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call uploadDocument on submit', () => {
    component.selectedFile = new File([''], 'test.pdf');
    component.uploadForm.setValue({ title: 'Test', description: '', fileType: 'pdf' });
    documentService.uploadDocument.and.returnValue(of(dummyDoc));
    component.onSubmit();
    expect(documentService.uploadDocument).toHaveBeenCalled();
  });
}); 