import type { PropsWithChildren } from 'react'
import { Fragment } from 'react'

const Loading = (
  props: PropsWithChildren & { length?: number; keyname?: string }
) => {
  return (
    <>
      {Array.from({ length: props.length ?? 5 }, (_, i) => i).map((i) => (
        <Fragment
          key={props.keyname ? `${props.keyname}-${i}` : `loading-${i}`}
        >
          {props.children}
        </Fragment>
      ))}
    </>
  )
}

export { Loading }
