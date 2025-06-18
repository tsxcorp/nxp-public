'use client'
import type { NavigationItem } from '@/directus/types'
import { Link } from '@/lib/navigation'
import VIcon from '@/components/base/VIcon'
import { convertIconName } from '@/lib/utils/strings'

interface ExtendedNavigationItem extends NavigationItem {
  icon?: string
  has_children?: boolean
  open_in_new_tab?: boolean
  label?: string
  children?: ExtendedNavigationItem[]
}

function getUrl(item: ExtendedNavigationItem) {
  if (item.type === 'page' && typeof item.page !== 'string') {
    return `/${item.page?.translations[0]?.permalink}`
  } else {
    return item?.url ?? ''
  }
}

function NavigationChildrenItems({
  items,
  detail = true,
}: {
  items: ExtendedNavigationItem[]
  detail?: boolean
}) {
  return (
    <>
      {items.map((childItem) => (
        <li key={childItem.id}>
          <Link href={getUrl(childItem)}>
            {detail && childItem.icon && (
              <VIcon
                icon={convertIconName(childItem.icon)}
                className='h-10 w-10'
              />
            )}
            <div className='whitespace-nowrap font-bold'>{childItem.translations[0]?.title}</div>
            {detail && childItem.label && (
              <p className='mt-1 text-sm leading-tight'>{childItem.label}</p>
            )}
          </Link>
        </li>
      ))}
    </>
  )
}

function NavigationItem({
  item,
  mobile = false,
}: {
  item: ExtendedNavigationItem
  mobile?: boolean
}) {
  // https://reacthustle.com/blog/how-to-close-daisyui-dropdown-with-one-click
  const handleClick = () => {
    const elem = document.activeElement
    if (elem) {
      // @ts-ignore
      elem?.blur()
    }
  }

  return (
    <>
      {!item.has_children && (
        <li onClick={handleClick}>
          <Link
            href={getUrl(item)}
            target={item.open_in_new_tab ? '_blank' : '_self'}
          >
            {!mobile && item.icon && (
              <VIcon icon={convertIconName(item.icon)} />
            )}
            {item.translations[0]?.title}
          </Link>
        </li>
      )}
      {item.has_children && !mobile && item.children && (
        <li onClick={handleClick} tabIndex={0}>
          <details>
            <summary>{item.translations[0]?.title}</summary>
            <ul className='z-10 p-2'>
              <NavigationChildrenItems
                detail={true}
                items={item.children}
              ></NavigationChildrenItems>
            </ul>
          </details>
        </li>
      )}
      {item.has_children && mobile && item.children && (
        <li onClick={handleClick}>
          <a>{item.translations[0]?.title}</a>
          <ul className='z-10 p-2'>
            <NavigationChildrenItems
              detail={false}
              items={item.children}
            ></NavigationChildrenItems>
          </ul>
        </li>
      )}
    </>
  )
}

export default function NavigationItems({
  items,
  mobile,
  className,
  tabIndex,
}: {
  items: ExtendedNavigationItem[]
  mobile?: boolean
  className?: string
  tabIndex?: number
}) {
  const handleClick = () => {
    const elem = document.activeElement
    if (elem) {
      // @ts-ignore
      elem?.blur()
    }
  }

  return (
    <>
      <ul tabIndex={tabIndex} className={className} onClick={handleClick}>
        {items.map((item) => (
          <NavigationItem
            mobile={mobile}
            key={item.id}
            item={item}
          ></NavigationItem>
        ))}
      </ul>
    </>
  )
}
