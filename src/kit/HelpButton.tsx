import { ReactNode } from 'react'

import { ReactComponent as HelpIcon } from '../assets/help.svg'

const HelpButton = ({ children }: {
  children?: ReactNode,
}) => (
  <>
    <button className="w-6 h-6 flex items-center justify-center  opacity-[0.48] enabled:hover:opacity-[0.8] enabled:active:opacity-[1] enabled:active:scale-[90%] transition-all">
      <div className="w-5 h-5 flex items-center justify-center">
        <HelpIcon />
      </div>
    </button>
    {children}
  </>
)

export default HelpButton
