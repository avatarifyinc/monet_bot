import cx from 'classnames'
import { ReactNode } from 'react'

import Debug from './Debug'
import Limiter from './Limiter'

function Screen({ children, className, isBottomButton }: {
  children: ReactNode,
  className?: string
  isBottomButton?: boolean
}) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const isHeader = !window?.Telegram?.WebApp
  return (
    <div className={cx(
      'fixed top-0 left-0 w-full h-full overflow-y-auto text-text bg-bg',
      isHeader && 'pt-[54px]',
    )}>
      <Limiter className={cx(
        "min-h-full p-4",
        isBottomButton && 'pb-[82px]',
        className,
      )}>
        {children}
        <Debug />
      </Limiter>
    </div>
  )
}

export default Screen
