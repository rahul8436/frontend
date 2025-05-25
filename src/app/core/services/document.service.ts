import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Document } from '../models/document.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor(private apiService: ApiService) {}

  getDocuments(): Observable<Document[]> {
    return this.apiService.get<Document[]>('/api/documents/');
  }

  getDocument(id: number): Observable<Document> {
    return this.apiService.get<Document>(`/api/documents/${id}`);
  }

  createDocument(data: FormData): Observable<Document> {
    return this.apiService.post<Document>('/api/documents/', data);
  }

  updateDocument(id: number, data: Partial<Document>, file?: File | null): Observable<Document> {
    // Split file from metadata
    const { title, description, file_type } = data;
    const metadata: any = { title, description, file_type };
    return this.apiService.putFile(`/api/documents/${id}`, file || null, metadata);
  }

  deleteDocument(id: number): Observable<void> {
    return this.apiService.delete<void>(`/api/documents/${id}`);
  }

  downloadDocument(id: number): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/octet-stream',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    
    return this.apiService.get<Blob>(`/api/documents/${id}/download`);
  }

  uploadDocument(file: File, metadata: any): Observable<Document> {
    return this.apiService.uploadFile('/api/documents/', file, metadata);
  }
} 