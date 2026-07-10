import type { OpportunitiesResponse, Opportunity } from '../types/api';
import { apiGet } from './http';

export interface SearchOpportunitiesParams {
  keyword?: string;
  entity?: string;
  status?: string;
  published_after?: string;
  page?: number;
  page_size?: number;
}

function buildSearchQuery(params: SearchOpportunitiesParams): string {
  const searchParams = new URLSearchParams();
  if (params.keyword) {
    searchParams.set('query', params.keyword);
  }
  if (params.entity) {
    searchParams.set('entity', params.entity);
  }
  if (params.status) {
    searchParams.set('status', params.status);
  }
  if (params.page) {
    searchParams.set('page', String(params.page));
  }
  if (params.page_size) {
    searchParams.set('limit', String(params.page_size));
  }
  return searchParams.toString();
}

export async function searchOpportunities(
  token: string,
  params: SearchOpportunitiesParams = {},
): Promise<OpportunitiesResponse> {
  const queryString = buildSearchQuery(params);
  return apiGet<OpportunitiesResponse>(`/api/v1/opportunities${queryString ? `?${queryString}` : ''}`, token);
}

export async function getOpportunityById(token: string, id: number): Promise<Opportunity> {
  return apiGet<Opportunity>(`/api/v1/opportunities/${id}`, token);
}

export const getOpportunity = getOpportunityById;
