import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DocumentService } from './document.service';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

const dummyDoc = {
  id: 1,
  title: 'Doc',
  description: '',
  file_type: 'pdf',
  file_path: '',
  created_by: 1,
  created_at: '',
  updated_at: ''
};

describe('DocumentService', () => {
  let service: DocumentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentService, ApiService]
    });
    service = TestBed.inject(DocumentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch documents', () => {
    service.getDocuments().subscribe(docs => {
      expect(docs).toEqual([dummyDoc]);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/api/documents/`);
    expect(req.request.method).toBe('GET');
    req.flush([dummyDoc]);
  });

  it('should fetch a document', () => {
    service.getDocument(1).subscribe(doc => {
      expect(doc).toEqual(dummyDoc);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/api/documents/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDoc);
  });

  it('should create a document', () => {
    const formData = new FormData();
    service.createDocument(formData).subscribe(doc => {
      expect(doc).toEqual(dummyDoc);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/api/documents/`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyDoc);
  });

  it('should update a document', () => {
    service.updateDocument(1, { title: 'Updated', file_type: 'pdf' }).subscribe(doc => {
      expect(doc).toEqual(dummyDoc);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/api/documents/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(dummyDoc);
  });

  it('should delete a document', () => {
    service.deleteDocument(1).subscribe(res => {
      expect(res).toBeTruthy();
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/api/documents/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });
}); 