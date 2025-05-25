import { Document } from './document.model';

export enum IngestionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum IngestionSourceType {
  FILE = 'file',
  URL = 'url',
  API = 'api'
}

export interface Ingestion {
  id: number;
  document_id: number;
  status: IngestionStatus;
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
} 