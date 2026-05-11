import { timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { TAGS } from '@/lib/integrations/constants'
import { config } from '@/lib/utils/config'

/**
 * Constant-time secret comparison. Returns false fast when lengths
 * differ (the secret's length is not itself sensitive here), otherwise
 * compares all bytes in constant time so string-equality timing doesn't
 * leak prefix matches to a network attacker.
 */
function safeEqual(a: string | null | undefined, b: string | undefined): boolean {
  if (!a || !b) return false
  if (a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

// If plan to edit the revalidation keep in mind the Shopify Store setup
// https://admin.shopify.com/store/[store-name]/settings/notifications/webhooks
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = ['collections/create', 'collections/delete', 'collections/update']
  const productWebhooks = ['products/create', 'products/delete', 'products/update']

  const topic = (await headers()).get('x-shopify-topic') || 'unknown'
  const secret = req.nextUrl.searchParams.get('secret')
  const isCollectionUpdate = collectionWebhooks.includes(topic)
  const isProductUpdate = productWebhooks.includes(topic)

  // Constant-time check runs before any cache invalidation side effect.
  if (!safeEqual(secret, config.shopifyRevalidationSecret)) {
    console.error('Invalid revalidation secret.')
    return NextResponse.json({ status: 401 })
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 })
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections, "shopify")
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products, "shopify")
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() })
}