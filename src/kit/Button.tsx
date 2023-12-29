import cx from 'classnames'
import { MainButton, useHapticFeedback, useWebApp } from '@vkruglikov/react-telegram-web-app'

// import { useSplash } from '../hooks'
import Loader from './Loader'

type TButton = {
  text: string,
  theme?: 'default' | 'text' | 'radio'
  isBottom?: boolean
  isActive?: boolean
  disabled?: boolean
  isBusy?: boolean
  onClick: () => void
}

function Button({ theme = 'default', isBottom, isActive, text, disabled, isBusy, onClick }: TButton) {
  const webApp = useWebApp()
  // const { isSplash } = useSplash()
  const isSplash = false
  const [impactOccurred] = useHapticFeedback()


  const onClickVibro = disabled ? undefined : () => {
    console.log('Button vibro')
    impactOccurred(isBottom ? 'heavy' : 'light')
    onClick()
  }

  if (isBottom && webApp && webApp.platform !== 'unknown') {
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
    'default': 'mx-auto w-full block h-10 bg-accent text-white rounded-[12px] text-[17px] leading-[22px] font-semibold enabled:hover:brightness-110 enabled:active:brightness-[1.2] transition-all',

    'text': 'h-6 text-[17px] leading-[22px] text-accent font-semibold hover:brightness-[1.2] active:brightness-[1.4] transition-all',

    'radio': `h-8 rounded-full border border-accent px-3 py-[6px] text-[15px] leading-[20px] font-semibold hover:brightness-[1.2] active:brightness-[1.4] transition-all ${!isActive ? 'text-accent' : 'bg-accent text-white'}`,
  }[theme]

  return (
    <div className={cx(isBottom && 'h-[50px]')}>{/* spacer */}
      <div className={cx(isBottom ? 'fixed bottom-0 left-0 w-full px-4 py-2 bg-bg' : 'relative')}>{/* loader wrapper */}
        {isBottom && (
          <div className="absolute bottom-full left-0 w-full h-2 bg-gradient-to-t from-bg border-b-[0.33px] border-[#3c3c431f]" />
        )}
        <button
          className={cx(
            themeStyle,
            isBottom && '!h-[50px]',
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
