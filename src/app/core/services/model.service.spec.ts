import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ModelService } from './model.service';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { Model, ModelType } from '../models/model.model';

describe('ModelService', () => {
  let service: ModelService;
  let httpMock: HttpTestingController;
  let apiService: ApiService;

  const mockModel: Model = {
    id: 1,
    name: 'Test Model',
    type: ModelType.LLM,
    description: 'Test description',
    parameters: {
      temperature: 0.7,
      max_tokens: 100
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ModelService, ApiService]
    });
    service = TestBed.inject(ModelService);
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all models', () => {
    service.getModels().subscribe((models: Model[]) => {
      expect(models).toEqual([mockModel]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/models/`);
    expect(req.request.method).toBe('GET');
    req.flush([mockModel]);
  });

  it('should get model by id', () => {
    service.getModel(1).subscribe((model: Model) => {
      expect(model).toEqual(mockModel);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/models/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockModel);
  });

  it('should create model', () => {
    const newModel = {
      name: 'New Model',
      type: ModelType.LLM,
      description: 'New description',
      parameters: {
        temperature: 0.8,
        max_tokens: 200
      }
    };

    service.createModel(newModel).subscribe((model: Model) => {
      expect(model).toEqual({ ...newModel, id: 2, created_at: '', updated_at: '' });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/models/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newModel);
    req.flush({ ...newModel, id: 2, created_at: '', updated_at: '' });
  });

  it('should update model', () => {
    const updatedModel = {
      name: 'Updated Model',
      description: 'Updated description',
      parameters: {
        temperature: 0.9,
        max_tokens: 300
      }
    };

    service.updateModel(1, updatedModel).subscribe((model: Model) => {
      expect(model).toEqual({ ...updatedModel, id: 1, type: ModelType.LLM, created_at: '', updated_at: '' });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/models/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedModel);
    req.flush({ ...updatedModel, id: 1, type: ModelType.LLM, created_at: '', updated_at: '' });
  });

  it('should delete model', () => {
    service.deleteModel(1).subscribe((response: any) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/models/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

  it('should handle error when getting models', () => {
    service.getModels().subscribe({
      error: (error: any) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/models/`);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should get models by type', () => {
    service.getModelsByType(ModelType.LLM).subscribe((models: Model[]) => {
      expect(models).toEqual([mockModel]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/models/?type=${ModelType.LLM}`);
    expect(req.request.method).toBe('GET');
    req.flush([mockModel]);
  });
}); 