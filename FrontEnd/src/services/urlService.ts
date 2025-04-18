import { http } from './http';

export interface ShortUrl {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdBy: string;
  createdAt: string;
}

/** Отримати всі короткі URL */
export function fetchUrls(): Promise<ShortUrl[]> {
  return http<ShortUrl[]>('/api/ShortUrls');
}

/** Створити новий короткий URL */
export function createUrl(originalUrl: string): Promise<ShortUrl> {
  return http<ShortUrl>('/api/ShortUrls', {
    method: 'POST',
    body: JSON.stringify({ originalUrl }),
  });
}

/** Видалити існуючий короткий URL */
export function deleteUrl(id: number): Promise<void> {
  return http<void>(`/api/ShortUrls/${id}`, { method: 'DELETE' });
}