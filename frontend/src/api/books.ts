import api from './client';
import type { Book, BookCreate, DashboardData } from '../types';

export const booksApi = {
  list: async (params: { skip?: number; limit?: number; search?: string }): Promise<Book[]> => {
    const { data } = await api.get('/books/', { params });
    return data;
  },

  getById: async (id: number): Promise<Book> => {
    const { data } = await api.get(`/books/${id}`);
    return data;
  },

  create: async (book: BookCreate): Promise<Book> => {
    const { data } = await api.post('/books/', book);
    return data;
  },

  update: async (id: number, book: Partial<BookCreate>): Promise<Book> => {
    const { data } = await api.put(`/books/${id}`, book);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/books/${id}`);
  },

  getDashboard: async (): Promise<DashboardData> => {
    const { data } = await api.get('/dashboard/');
    return data;
  },
};
