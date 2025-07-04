import directusApi from '@/directus/client'
import { readItems } from '@directus/sdk'
import { Link } from '@/lib/navigation'
import VBadge from '@/components/base/VBadge'
import type { Categories } from '@/directus/types'
import type { ValidCollectionType } from '@/types/directus'


async function fetchData() {
  const categories = await directusApi.request(
    readItems('categories' as any, {
      fields: ['*']
    })
  )
  return categories as Categories[]
}

export default async function Categories() {
  const categories = await fetchData()

  return (
    <div className='mt-4 flex flex-col space-y-2'>
      {categories.map((category) => {
        return (
          <Link
            key={category.id}
            href={`/posts/categories/${category.slug}`}
            className='font-mono hover:opacity-80'
          >
            <VBadge color={category.color as any} size='lg'>
              {category.title}
            </VBadge>
          </Link>
        )
      })}
    </div>
  )
}
