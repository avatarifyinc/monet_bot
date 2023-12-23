import cx from 'classnames'
import { MainButton, useHapticFeedback, useWebApp } from '@vkruglikov/react-telegram-web-app'

// import { useSplash } from '../hooks'
import Loader from './Loader'

type TButton = {
  text: string,
  theme?: 'default' | 'text'
  isBottom?: boolean
  disabled?: boolean
  isBusy?: boolean
  onClick: () => void
}

function Button({ theme = 'default', isBottom, text, disabled, isBusy, onClick }: TButton) {
  const webApp = useWebApp()
  // const { isSplash } = useSplash()
  const isSplash = false
  const [impactOccurred] = useHapticFeedback()


  const onClickVibro = disabled ? undefined : () => {
    console.log('Button vibro')
    impactOccurred(isBottom ? 'heavy' : 'light')
    onClick()
  }

  if (isBottom && webApp.platform !== 'unknown') {
    if (isSplash) {
      return null
    }
    return (
      <MainButton
        text={text}
        disabled={disabled}
        progress={isBusy}
        color={disabled ? '#888888' : undefined}
        onClick={onClickVibro}
    />)
  }

  const themeStyle = {
    'default': 'mx-auto w-full block h-10 bg-accent text-buttonText rounded-md text-[14px] leading-[20px] font-semibold enabled:hover:brightness-110 enabled:active:brightness-[1.2] transition-all',

    'text': 'h-6 text-[14px] leading-[24px] text-accent hover:brightness-[1.2] active:brightness-[1.4] transition-all'
  }[theme]

  return (
    <div className={cx(isBottom && 'h-[56px]')}>{/* spacer */}
      <div className={cx(isBottom ? 'fixed bottom-0 left-0 w-full pt-1 bg-bg' : 'relative')}>{/* loader wrapper */}
        {isBottom && (
          <div className="absolute bottom-full left-0 w-full h-2 bg-gradient-to-t from-bg" />
        )}
        <button
          className={cx(
            themeStyle,
            isBottom && '!h-[56px]',
            'disabled:opacity-40 disabled:cursor-not-allowed'
          )}
          disabled={disabled || isBusy}
          onClick={onClickVibro}
        >
          {text}
        </button>
        {isBusy && <Loader size={30} />}
      </div>
    </div>
  )
}

export default Button
