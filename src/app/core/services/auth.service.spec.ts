import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { User, UserRole } from '../models/user.model';
import { Router } from '@angular/router';

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let apiService: ApiService;
  let router: Router;

  const mockUser: User = {
    id: 1,
    full_name: 'Test User',
    email: 'test@example.com',
    role: UserRole.ADMIN,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  const mockToken = {
    access_token: 'test-token',
    token_type: 'bearer'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        ApiService,
        { provide: Router, useClass: MockRouter }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

 
  it('should handle login error', () => {
    service.login('test@example.com', 'wrong-password').subscribe({
      error: (error: any) => {
        expect(error.status).toBe(401);
      }
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/token`);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });
}); 