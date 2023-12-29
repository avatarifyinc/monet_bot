import cx from 'classnames'

import { ReactComponent as ToolUndo } from '../assets/tool-undo.svg'
import { ReactComponent as ToolRedo } from '../assets/tool-redo.svg'
import { ReactComponent as ToolDraw } from '../assets/tool-draw.svg'
import { ReactComponent as ToolErase } from '../assets/tool-erase.svg'
import { ReactComponent as ToolInvert } from '../assets/tool-invert.svg'
import { ReactComponent as ToolClear } from '../assets/tool-clear.svg'

const Tool = ({ type, isActive, onClick }: {
  type: 'Undo' | 'Redo' | 'Draw' | 'Erase' | 'Invert' | 'Clear',
  isActive?: boolean
  onClick?: () => void
}) => (
  <button
    className={cx('flex flex-col items-center', isActive && 'text-accent')}
    onClick={onClick}
  >
    {{
      'Undo': <ToolUndo />,
      'Redo': <ToolRedo />,
      'Draw': <ToolDraw />,
      'Erase': <ToolErase />,
      'Invert': <ToolInvert />,
      'Clear': <ToolClear />
    }[type]}
    <div className="text-[11px] leading-[13px] font-semibold tracking-[-0.2px]">{type}</div>
  </button>
)

export default Tool
