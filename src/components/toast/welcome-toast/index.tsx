import { cookies } from 'next/headers';
import { WelcomeToastClient } from './client';

/**
 * One-time welcome toast. Server/client split:
 *
 * - This file is a server component — reads the `welcome-toast` cookie
 *   server-side and short-circuits to `null` when the user has already
 *   seen the toast, so we never ship `WelcomeToastClient` to those sessions.
 * - `WelcomeToastClient` is the `'use client'` shell that calls
 *   `useToastOnce` to actually fire the sonner toast.
 *
 * @example
 * ```tsx
 * <body>
 *   {children}
 *   <WelcomeToast />
 * </body>
 * ```
 */
export async function WelcomeToast() {
  const cookieStore = await cookies();
  const hasSeenToast = cookieStore.get('welcome-toast')?.value === "2";

  if (hasSeenToast) return null;

  return <WelcomeToastClient />;
}