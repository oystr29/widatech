import type { JSX, PropsWithChildren } from 'react'

type Flashlistprops = {
  isloading?: boolean
  loading?: JSX.Element
  isfallback?: boolean
  fallback?: JSX.Element
}

function Flashlist(props: Flashlistprops & PropsWithChildren) {
  if (props.isloading && props.loading) {
    return props.loading
  }

  if (props.isfallback && props.fallback) {
    return props.fallback
  }
  return <>{props.children}</>
}

export default Flashlist
