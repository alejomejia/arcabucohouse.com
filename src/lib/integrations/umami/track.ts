import { isProd } from "@/lib/utils/config";

export type UmamiTrackProps = Record<
  string,
  string | number | boolean | null | undefined
>;

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: UmamiTrackProps) => void;
    };
  }
}

/**
 * Sends a named event to Umami. Safe to call from any client context:
 * silently no-ops outside production, on the server, or when the script
 * hasn't loaded (blocked by an extension, network failure, etc.).
 */
export function trackEvent(name: string, props?: UmamiTrackProps): void {
  if (!isProd) return;
  if (typeof window === "undefined") return;
  if (!window.umami) return;

  window.umami.track(name, props);
}
