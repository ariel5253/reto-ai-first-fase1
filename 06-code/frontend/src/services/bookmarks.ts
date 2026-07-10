import type { Bookmark, BookmarkRequest } from '../types/api';
import { apiDelete, apiGet, apiPost } from './http';

export interface BookmarksResponse { items: Bookmark[]; total: number }

export function createBookmark(token: string, payload: BookmarkRequest): Promise<Bookmark> {
  return apiPost<Bookmark, BookmarkRequest>('/api/v1/bookmarks', payload, token);
}

export function listBookmarks(token: string): Promise<BookmarksResponse> {
  return apiGet<BookmarksResponse>('/api/v1/bookmarks', token);
}

export function deleteBookmark(token: string, id: number): Promise<void> {
  return apiDelete(`/api/v1/bookmarks/${id}`, token);
}
