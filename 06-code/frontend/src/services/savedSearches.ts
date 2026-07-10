import type { CreateSavedSearchRequest, SavedSearch, SavedSearchesResponse } from '../types/api';
import { apiDelete, apiGet, apiPost } from './http';

export function createSavedSearch(token: string, payload: CreateSavedSearchRequest): Promise<SavedSearch> {
  return apiPost<SavedSearch, CreateSavedSearchRequest>('/api/v1/saved-searches', payload, token);
}

export function listSavedSearches(token: string): Promise<SavedSearchesResponse> {
  return apiGet<SavedSearchesResponse>('/api/v1/saved-searches', token);
}

export function deleteSavedSearch(token: string, id: number): Promise<void> {
  return apiDelete(`/api/v1/saved-searches/${id}`, token);
}
