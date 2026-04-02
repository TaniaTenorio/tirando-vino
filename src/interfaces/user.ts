export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  country_code: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}
