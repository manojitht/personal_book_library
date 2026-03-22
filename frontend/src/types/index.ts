export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  publication_date?: string;
  isbn?: string;
  cover_image_url?: string;
  owner_id: number;
}

export interface BookCreate {
  title: string;
  author: string;
  publication_date?: string;
  isbn?: string;
  cover_image_url?: string;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  user_id: number;
  book_id: number;
}

export interface DashboardData {
  total_books: number;
  recent_books: Book[];
}

export interface PaginatedBooks {
  books: Book[];
  total: number;
}
