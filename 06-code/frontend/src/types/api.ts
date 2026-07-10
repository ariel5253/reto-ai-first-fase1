// Auth
export interface RegisterRequest { email: string; password: string; full_name: string }
export interface LoginRequest { email: string; password: string }
export interface AuthResponse { access_token: string; token_type: string }
export interface UserResponse { id: number; email: string; full_name: string | null; created_at: string }

// Opportunities
export interface Opportunity {
  id: number;
  title: string;
  entity: string;
  description: string;
  status: 'activo' | 'cerrado' | 'adjudicado';
  estimated_amount_cents: number;
  published_at: string;
  closing_at: string | null;
  detail_url: string;
  source_id: string;
}
export interface OpportunitiesResponse { items: Opportunity[]; total: number }

// Bookmarks
export interface Bookmark { id: number; opportunity_id: number; user_id: number; created_at: string }
export interface BookmarkRequest { opportunity_id: number }

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
