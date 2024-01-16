import { MouseEventHandler } from 'react'
import { BackButton } from '@vkruglikov/react-telegram-web-app'

import { ReactComponent as BackIcon } from '../assets/back.svg'

type THeader = {
  onBack?: () => void
  onCancel?: MouseEventHandler<HTMLButtonElement>
}

function Header({ onBack, onCancel }: THeader) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (window?.Telegram?.WebApp?.platform && window?.Telegram?.WebApp?.platform !== 'unknown') {
    return (
      <BackButton
        onClick={onBack}
      />
    )
  }

  return (
    <header className="z-[1] fixed top-0 left-0 w-full bg-bg flex items-center justify-center h-[54px] border-b-[0.33px] border-[#3c3c431f]">
      {onCancel &&
        <button className="absolute left-4 top-1/2 -translate-y-1/2 text-accent font-normal hover:brightness-[1.2] active:brightness-[1.4] transition-all" onClick={onCancel}>Cancel</button>
      }
      {onBack &&
        <button className="flex items-center gap-[5px] absolute left-4 top-1/2 -translate-y-1/2 text-accent font-normal hover:brightness-[1.2] active:brightness-[1.4] transition-all" onClick={onBack}>
          <BackIcon />
          <span>Back</span>
        </button>
      }
      <div className="flex flex-col items-center justify-center gap-0.5">
        <div className="text-[17px] leading-[22px] font-medium">Monet AI</div>
        <div className="-mt-[3px] text-[13px] leading-[18px] opacity-60">Bot</div>
      </div>
    </header>
  )
}

export default Header
