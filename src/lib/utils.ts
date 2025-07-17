import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Redirects the user to the admin-configured Submit Music URL.
 * Falls back to https://example.com if not set or on error.
 */
export async function handleSubmitMusicRedirect() {
  try {
    const res = await fetch('/api/auth/settings/submit-redirect-url');
    const data = await res.json();
    const url = data.url || 'https://example.com';
    window.location.href = url;
  } catch {
    window.location.href = 'https://example.com';
  }
}

export function getApiUrl(path: string) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `https://backend.jamjournal.com/${cleanPath}`;
}

