import type { CreateSavedSearchRequest, SavedSearch, SavedSearchesResponse } from '../types/api';
import { apiDelete, apiGet, apiPost } from './http';

export async function listSavedSearches(token: string): Promise<SavedSearchesResponse> {
  return apiGet<SavedSearchesResponse>('/api/v1/saved-searches', token);
}

export async function createSavedSearch(
  token: string,
  body: CreateSavedSearchRequest,
): Promise<SavedSearch> {
  return apiPost<SavedSearch, CreateSavedSearchRequest>('/api/v1/saved-searches', body, token);
}

export async function deleteSavedSearch(token: string, id: number): Promise<void> {
  return apiDelete(`/api/v1/saved-searches/${id}`, token);
}
