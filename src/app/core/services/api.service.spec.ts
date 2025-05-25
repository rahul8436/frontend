import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch data with GET', () => {
    const dummy = [{ id: 1 }];
    service.get('/api/test').subscribe(data => {
      expect(data).toEqual(dummy);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/api/test`);
    expect(req.request.method).toBe('GET');
    req.flush(dummy);
  });

  it('should send data with POST', () => {
    const payload = { name: 'Test' };
    const response = { id: 1, ...payload };
    service.post('/api/test', payload).subscribe(data => {
      expect(data).toEqual(response);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/api/test`);
    expect(req.request.method).toBe('POST');
    req.flush(response);
  });

  it('should update data with PUT', () => {
    const payload = { name: 'Updated' };
    const response = { id: 1, ...payload };
    service.put('/api/test/1', payload).subscribe(data => {
      expect(data).toEqual(response);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/api/test/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(response);
  });

  it('should delete data with DELETE', () => {
    service.delete('/api/test/1').subscribe(data => {
      expect(data).toBeTruthy();
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/api/test/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });
}); 