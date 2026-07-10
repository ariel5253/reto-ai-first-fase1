// Auth
export interface RegisterRequest { email: string; password: string; full_name: string }
export interface LoginRequest { email: string; password: string }
export interface AuthResponse { access_token: string; token_type: string }
export interface UserResponse { id: number; email: string; full_name: string | null; created_at: string }

// Opportunities
export type OpportunityStatus = 'activo' | 'cerrado' | 'adjudicado' | string;

export interface Opportunity {
  id: number;
  title: string;
  description?: string | null;
  entity_name: string;
  status: OpportunityStatus | null;
  estimated_amount_cents: number | null;
  published_at: string | null;
  closing_at: string | null;
  detail_url: string | null;
  external_id?: string;
  external_process_id?: string | null;
}
export interface OpportunitiesResponse { items: Opportunity[]; total: number }

// Bookmarks
export interface Bookmark {
  id: number;
  opportunity_id: number;
  user_id?: number;
  title?: string;
  entity_name?: string;
  notes?: string | null;
  created_at: string;
}
export interface BookmarkRequest { opportunity_id: number }
export interface BookmarksResponse { items: Bookmark[]; total: number }

// Saved Searches
export interface SavedSearchFilter { key: string; value: string }
export interface SavedSearch {
  id: number;
  name: string;
  filters: SavedSearchFilter[];
  created_at: string;
}
export interface SavedSearchesResponse { items: SavedSearch[]; total: number }
export interface CreateSavedSearchRequest { name: string; filters: SavedSearchFilter[] }
