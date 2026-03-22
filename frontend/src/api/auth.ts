import api from './client';
import type { User } from '../types';

export const authApi = {
  signup: async (username: string, email: string, password: string): Promise<User> => {
    const { data } = await api.post('/auth/signup', { username, email, password });
    return data;
  },

  login: async (username: string, password: string): Promise<string> => {
    const form = new URLSearchParams();
    form.append('username', username);
    form.append('password', password);
    const { data } = await api.post('/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return data.access_token;
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get('/users/me');
    return data;
  },

  updateMe: async (payload: { username?: string; email?: string }): Promise<User> => {
    const { data } = await api.put('/users/me', payload);
    return data;
  },
};
