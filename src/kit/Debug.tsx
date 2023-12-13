// import cx from 'classnames'
// import { useCallback, useEffect, useState } from 'react'

function Debug() {
  /*
  const OPEN_DEBUG_RIGHT_CLICKS = 3

  const [n, setN] = useState(0)

  const listener = useCallback(() => {
    setN(n + 1)
  }, [n, setN])

  useEffect(() => {
    window.addEventListener('contextmenu', listener)
    return () => {
      window.removeEventListener('contextmenu', listener)
    }
  }, [listener])
  */

  return (
    // <div className={cx(n < OPEN_DEBUG_RIGHT_CLICKS && 'h-0 overflow-hidden')}>
    <div>
      <div className="mt-10 text-[12px] break-words overflow-x-auto">
        <h2>Debug</h2>
        <strong>window.Telegram.Webapp = </strong>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <pre>{JSON.stringify(window.Telegram?.WebApp, null, 2)}</pre>
      </div>
    </div>
  )
}

export default Debug
