import Config from 'react-native-config';
import { getIdToken } from './session';

const BASE = (Config.API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getIdToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`[${res.status}] ${path} ${await res.text().catch(()=> '')}`);
  return res.json() as Promise<T>;
}

export const API = {
  getTasks: () => http<any[]>('/api/tasks'),
  getTask: (id: string) => http<any>(`/api/tasks/${id}`),
  getMyTasks: () => http<any[]>('/api/my/tasks'), // requires token
  createTask: (body: any) => http<any>('/api/tasks', { method: 'POST', body: JSON.stringify(body) }),
};

export default API;
