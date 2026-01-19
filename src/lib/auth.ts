import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'mtbs_admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function validateAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable not set');
    return false;
  }
  return password === adminPassword;
}

export async function createAdminSession(): Promise<string> {
  const sessionId = crypto.randomUUID();
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  });

  return sessionId;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);
  return !!session?.value;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
