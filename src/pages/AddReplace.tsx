import { useState } from 'react'

import Button from '../kit/Button'
import Input from '../kit/Input'
import Tool from '../kit/Tool'
import ToolBar from '../kit/ToolBar'
import Screen from '../kit/Screen'

import { ReactComponent as IconSettings } from '../assets/settings.svg'

function AddReplace() {
  const [currentTool, setCurrentTool] = useState('Draw')
  const [isSettingsOpen, setSettingsOpen] = useState(false)

  return (
    <Screen>
      AddReplace soon...

      <ToolBar groups={[
        <>
          <Tool type="Undo" onClick={() => {}} />
          <Tool type="Redo" onClick={() => {}} />
        </>,
        <>
          <Tool type="Draw" isActive={currentTool == 'Draw'} onClick={() => { setCurrentTool('Draw') }} />
          <Tool type="Erase" isActive={currentTool == 'Erase'} onClick={() => { setCurrentTool('Erase') }} />
        </>,
        <>
          <Tool type="Invert" onClick={() => {}} />
          <Tool type="Clear" onClick={() => {}} />
        </>
      ]} />

      <div className="mt-4 flex gap-3">
        <Input
          placeholder="Prompt, e.g. darth vader"
          onChange={() => {}}
        />
        <button
          className="w-[44px] h-[44px] flex items-center justify-center text-accent"
          onClick={() => { setSettingsOpen(true) }}
        >
          <IconSettings />
        </button>
      </div>

      {isSettingsOpen && (
        <div>Settings soon...</div>
      )}

      <Button
        isBottom
        text="Generate"
        onClick={() => {}}
        // disabled={isButtonDisabled}
        // isBusy={isBusy}
      />
    </Screen>
  )
}

export default AddReplace
