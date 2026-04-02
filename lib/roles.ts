export type AppRole = 'admin' | 'viewer';

export const normalizeRole = (value: unknown): AppRole => {
  if (value === 'viewer') {
    return 'viewer';
  }

  // Default to admin for personal/single-user usage.
  return 'admin';
};
