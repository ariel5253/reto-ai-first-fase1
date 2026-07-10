import type { OpportunitiesResponse, Opportunity } from '../types/api';
import { apiGet } from './http';

export interface SearchOpportunitiesParams {
  query?: string;
  entity?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export function searchOpportunities(params: SearchOpportunitiesParams = {}): Promise<OpportunitiesResponse> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return apiGet<OpportunitiesResponse>(`/api/v1/opportunities${queryString ? `?${queryString}` : ''}`);
}

export function getOpportunity(id: number): Promise<Opportunity> {
  return apiGet<Opportunity>(`/api/v1/opportunities/${id}`);
}
