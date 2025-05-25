import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from '../../../../core/services/api.service';
import { of } from 'rxjs';
import { UserRole } from '../../../../core/models/user.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

const dummyUsers = [
  { id: 1, full_name: 'Test User', email: 'test@example.com', role: UserRole.ADMIN, created_at: '', updated_at: '' }
];

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let apiService: ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserListComponent],
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatButtonModule,
        MatTableModule
      ],
      providers: [ApiService]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users', () => {
    spyOn(apiService, 'get').and.returnValue(of(dummyUsers));
    component.loadUsers();
    expect(component.users).toEqual(dummyUsers);
  });
}); 