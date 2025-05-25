import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Model, ModelType } from '../models/model.model';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  constructor(private apiService: ApiService) {}

  getModels(): Observable<Model[]> {
    return this.apiService.get<Model[]>('/api/models/');
  }

  getModel(id: number): Observable<Model> {
    return this.apiService.get<Model>(`/api/models/${id}`);
  }

  createModel(model: Partial<Model>): Observable<Model> {
    return this.apiService.post<Model>('/api/models/', model);
  }

  updateModel(id: number, model: Partial<Model>): Observable<Model> {
    return this.apiService.put<Model>(`/api/models/${id}`, model);
  }

  deleteModel(id: number): Observable<any> {
    return this.apiService.delete(`/api/models/${id}`);
  }

  getModelsByType(type: ModelType): Observable<Model[]> {
    return this.apiService.get<Model[]>(`/api/models/?type=${type}`);
  }
} 