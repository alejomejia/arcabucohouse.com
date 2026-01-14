import OpengraphImage from '@/components/from-template/opengraph-image'
import { getPage } from '@/lib/integrations/shopify'

export default async function Image({ params }: { params: { page: string } }) {
  const page = await getPage(params.page)
  const title = page.seo?.title || page.title

  return await OpengraphImage({ title })
}
