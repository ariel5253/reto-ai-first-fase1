import type { Bookmark, BookmarksResponse, BookmarkRequest } from '../types/api';
import { apiDelete, apiGet, apiPost } from './http';

export async function listBookmarks(token: string): Promise<BookmarksResponse> {
  return apiGet<BookmarksResponse>('/api/v1/bookmarks', token);
}

export async function createBookmark(token: string, opportunity_id: number): Promise<Bookmark> {
  const payload: BookmarkRequest = { opportunity_id };
  return apiPost<Bookmark, BookmarkRequest>('/api/v1/bookmarks', payload, token);
}

export async function deleteBookmark(token: string, bookmark_id: number): Promise<void> {
  return apiDelete(`/api/v1/bookmarks/${bookmark_id}`, token);
}
