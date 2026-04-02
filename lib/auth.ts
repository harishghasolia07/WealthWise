import { auth, currentUser } from '@clerk/nextjs/server';
import { AppRole, normalizeRole } from './roles';

export const getRequestAuth = async (): Promise<{ userId: string | null; role: AppRole }> => {
  const { userId } = auth();

  if (!userId) {
    return { userId: null, role: 'viewer' };
  }

  const user = await currentUser();
  const role = normalizeRole(user?.publicMetadata?.role);

  return { userId, role };
};
