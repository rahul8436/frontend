import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { User, UserRole } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let apiService: ApiService;

  const mockUsers: User[] = [
    {
      id: 1,
      full_name: 'Test User 1',
      email: 'test1@example.com',
      role: UserRole.ADMIN,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      full_name: 'Test User 2',
      email: 'test2@example.com',
      role: UserRole.VIEWER,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService, ApiService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all users', () => {
    service.getUsers().subscribe((users: User[]) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/users/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should get user by id', () => {
    service.getUser(1).subscribe((user: User) => {
      expect(user).toEqual(mockUsers[0]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/users/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers[0]);
  });

  it('should create user', () => {
    const newUser = {
      full_name: 'New User',
      email: 'new@example.com',
      password: 'password123',
      role: UserRole.VIEWER
    };

    service.createUser(newUser).subscribe((user: User) => {
      expect(user).toEqual({ ...newUser, id: 3, created_at: '', updated_at: '' });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/users/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush({ ...newUser, id: 3, created_at: '', updated_at: '' });
  });

  it('should update user', () => {
    const updatedUser = {
      full_name: 'Updated User',
      email: 'updated@example.com',
      role: UserRole.ADMIN
    };

    service.updateUser(1, updatedUser).subscribe((user: User) => {
      expect(user).toEqual({ ...updatedUser, id: 1, created_at: '', updated_at: '' });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/users/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedUser);
    req.flush({ ...updatedUser, id: 1, created_at: '', updated_at: '' });
  });

  it('should delete user', () => {
    service.deleteUser(1).subscribe((response: any) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/users/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

  it('should handle error when getting users', () => {
    service.getUsers().subscribe({
      error: (error: any) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/users/`);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
}); 