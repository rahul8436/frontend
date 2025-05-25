import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IngestionService } from './ingestion.service';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { Ingestion, IngestionStatus } from '../models/ingestion.model';

describe('IngestionService', () => {
  let service: IngestionService;
  let httpMock: HttpTestingController;
  let apiService: ApiService;

  const mockIngestion: Ingestion = {
    id: 1,
    document_id: 1,
    status: IngestionStatus.PENDING,
    started_at: '2024-01-01T00:00:00Z',
    completed_at: null,
    error_message: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IngestionService, ApiService]
    });
    service = TestBed.inject(IngestionService);
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all ingestions', () => {
    service.getIngestions().subscribe((ingestions: Ingestion[]) => {
      expect(ingestions).toEqual([mockIngestion]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/ingestion/`);
    expect(req.request.method).toBe('GET');
    req.flush([mockIngestion]);
  });

  it('should get ingestion by id', () => {
    service.getIngestion(1).subscribe((ingestion: Ingestion) => {
      expect(ingestion).toEqual(mockIngestion);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/ingestion/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockIngestion);
  });

  it('should trigger ingestion', () => {
    service.triggerIngestion(1).subscribe((ingestion: Ingestion) => {
      expect(ingestion).toEqual(mockIngestion);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/ingestion/trigger`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ document_id: 1 });
    req.flush(mockIngestion);
  });

  it('should get ingestion status', () => {
    service.getIngestionStatus(1).subscribe((status: IngestionStatus) => {
      expect(status).toBe(IngestionStatus.PENDING);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/ingestion/1/status`);
    expect(req.request.method).toBe('GET');
    req.flush(IngestionStatus.PENDING);
  });

  it('should handle error when getting ingestions', () => {
    service.getIngestions().subscribe({
      error: (error: any) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/ingestion/`);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});