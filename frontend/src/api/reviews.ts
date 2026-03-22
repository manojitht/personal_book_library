import api from './client';
import type { Review } from '../types';

export const reviewsApi = {
  list: async (bookId: number): Promise<{ reviews: Review[]; average_rating: number | null }> => {
    const { data } = await api.get(`/books/${bookId}/reviews/`);
    return data;
  },

  create: async (bookId: number, rating: number, comment?: string): Promise<Review> => {
    const { data } = await api.post(`/books/${bookId}/reviews/`, { rating, comment });
    return data;
  },
};
