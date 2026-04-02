export type AppRole = 'admin' | 'viewer';

export const normalizeRole = (value: unknown): AppRole => {
  return value === 'admin' ? 'admin' : 'viewer';
};
