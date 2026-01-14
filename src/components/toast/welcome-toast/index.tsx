import { cookies } from 'next/headers';
import { WelcomeToastClient } from './client';

/* Check in server component if we should show the toast based on cookie value */
export async function WelcomeToast() {
  const cookieStore = await cookies();
  const hasSeenToast = cookieStore.get('welcome-toast')?.value === "2";

  if (hasSeenToast) return null;

  return <WelcomeToastClient />;
}