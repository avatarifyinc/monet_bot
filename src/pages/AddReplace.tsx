import { useState } from 'react'

import Button from '../kit/Button'
import Screen from '../kit/Screen'
import Tool from '../kit/Tool'
import ToolBar from '../kit/ToolBar'

function AddReplace() {
  const [currentTool, setCurrentTool] = useState('Draw')
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
