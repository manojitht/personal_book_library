export interface User {
  username: string;
  email: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  publication_date?: string;
  cover_image_url?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}