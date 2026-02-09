"use client"

import { useToastOnce } from '@/lib/hooks/use-toast-once';

export function WelcomeToastClient() {
  useToastOnce({
    id: 'welcome-toast',
    cookieKey: 'welcome-toast',
    version: 2,
    minHeight: 650,
    title: '🛍️ Welcome to Next.js Commerce!',
    description: (
      <>
        This is a high-performance, SSR storefront powered by Shopify, Next.js,
        and Vercel.{' '}
        <a
          href="https://vercel.com/templates/next.js/nextjs-commerce"
          className="text-blue-600 hover:underline"
          target="_blank"
        >
          Deploy your own
        </a>
        .
      </>
    ),
  });

  return null;
}