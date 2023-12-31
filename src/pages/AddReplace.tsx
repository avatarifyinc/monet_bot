import { useState } from 'react'

import Button from '../kit/Button'
import Input from '../kit/Input'
import Tool from '../kit/Tool'
import ToolBar from '../kit/ToolBar'
import Screen from '../kit/Screen'

import testPhoto from '../assets/test-photo.jpg'

import { ReactComponent as IconSettings } from '../assets/settings.svg'

function AddReplace() {
  const [currentTool, setCurrentTool] = useState('Draw')
  const [isSettingsOpen, setSettingsOpen] = useState(false)

  return (
    <Screen isBottomButton className="flex flex-col">
      <div className="flex-1 bg-[#8881] relative">
        <img className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[100%] max-h-[100%]" src={testPhoto} />
      </div>

      <div className="">
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
      </div>

    <Button
      isBottom
      text={currentTool === 'Erase' ? 'Erase' : 'Generate'}
      onClick={() => {}}
      // disabled={isButtonDisabled}
      // isBusy={isBusy}
    />
    </Screen>
  )
}

export default AddReplace
