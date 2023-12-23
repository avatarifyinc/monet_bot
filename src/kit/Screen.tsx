import cx from 'classnames'
import { ReactNode } from 'react'

import Debug from './Debug'

type TScreen = {
  children: ReactNode,
  className?: string
}

function Screen({ children, className }: TScreen) {
  return (
    <div className={cx('fixed top-0 left-0 w-full h-full overflow-y-auto p-4 text-text bg-bg', className)}>
      <div className="limiter">
        {children}

        <Debug />
      </div>
    </div>
  )
}

export default Screen
