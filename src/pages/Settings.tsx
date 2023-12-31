import { useState } from 'react'

import Button from '../kit/Button'
import Header from '../kit/Header'
import Input from '../kit/Input'
import Screen from '../kit/Screen'

function Settings() {
  const ratios = [
    { title: 'Widescreen • 16:9' },
    { title: 'Vertical • 9:16' },
    { title: 'Square • 1:1' },
    { title: 'Photo • 4:3' },
    { title: 'Portrait • 4:5' },
    { title: 'Landscape • 3:2' },
    { title: 'Cinematic • 21:9' },
  ]
  const styles = [
    { title: 'No style' },
    { title: 'Photographic' },
    { title: 'Digital art' },
    { title: 'Comic Book' },
    { title: 'Fantasy Art' },
    { title: 'Analog Film' },
    { title: 'Neon Punk' },
    { title: 'Isometric' },
    { title: 'Low Poly' },
    { title: 'Origami' },
    { title: 'Line Art' },
    { title: 'Cinematic' },
    { title: '3D Model' },
    { title: 'Pixel Art' },
  ]

  const [currentRatio, setCurrentRatio] = useState(ratios[0])
  const [currentStyle, setCurrentStyle] = useState(styles[0])
  return (
    <Screen>
      <Header onBack={() => { history.back() }} />

      <div className="flex items-center justify-between">
        <h4 className="">Settings</h4>
        <Button theme="text" text="Reset" onClick={() => {}}></Button>
      </div>
      <div className="mt-6">
        <div className="mb-[9px] text-[17px] leading-[22px] font-semibold">Ratio</div>
        <div className="flex flex-wrap gap-2">
          {ratios.map(ratio => (
            <Button
              theme="radio"
              text={ratio.title}
              key={ratio.title}
              isActive={currentRatio.title === ratio.title}
              onClick={() => { setCurrentRatio(ratio) }}
            />
          ))}
        </div>
      </div>
      <div className="mt-6">
        <div className="mb-[9px] text-[17px] leading-[22px] font-semibold">Styles</div>
        <div className="flex flex-wrap gap-2">
          {styles.map(style => (
            <Button
              theme="radio"
              text={style.title}
              key={style.title}
              isActive={currentStyle.title === style.title}
              onClick={() => { setCurrentStyle(style) }}
            />
          ))}
        </div>
      </div>
      <div className="mt-6">
        <div className="mb-[9px] text-[17px] leading-[22px] font-semibold">Negative prompt</div>
        <Input
          placeholder="Prompt"
          onChange={() => {}}
        />
      </div>
      <Button
        isBottom
        text="Save"
        onClick={() => {}}
        // disabled={isButtonDisabled}
        // isBusy={isBusy}
      />
    </Screen>
  )
}

export default Settings
