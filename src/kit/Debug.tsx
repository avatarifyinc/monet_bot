import cx from 'classnames'
import { useCallback, useEffect, useState } from 'react'

function Debug({ isOpen }: {isOpen?: boolean}) {
  const OPEN_DEBUG_RIGHT_CLICKS = 3

  const [n, setN] = useState(0)

  const isTouchDevice = () =>
    (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    // @ts-ignore
    (navigator.msMaxTouchPoints > 0))

  const listener = useCallback(() => {
    if (!isTouchDevice()) {
      setN(n + 1)
    }
  }, [n, setN, isTouchDevice])

  useEffect(() => {
    window.addEventListener('contextmenu', listener)
    return () => {
      window.removeEventListener('contextmenu', listener)
    }
  }, [listener])

  return (
    <div className={cx('Debug', (!isOpen && n < OPEN_DEBUG_RIGHT_CLICKS) && 'h-0 overflow-hidden')}>
      <div>
        <div className="mt-10 text-[12px] break-words overflow-x-auto">
          <h2>Debug</h2>
          <strong>location.href = </strong>
          <pre className="whitespace-pre-wrap">
            {location.href}
          </pre>
          <br />
          <strong>window.Telegram.WebApp = </strong>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(window.Telegram?.WebApp, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default Debug
