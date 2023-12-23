import Button from '../kit/Button'
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
  return (
    <Screen>
      <div className="flex items-center justify-between">
        <h4 className="text-accent">Settings</h4>
        <Button theme="text" text="Reset" onClick={() => {}}></Button>
      </div>
      <div className="mt-6">
        <div className="text-[17px] leading-[22px]">Ratio</div>
        {ratios.map(ratio => (
          <Button theme="text" text={ratio.title} key={ratio.title} onClick={() => {}} />
        ))}
      </div>
      <div className="mt-6">
        <div className="text-[17px] leading-[22px]">Styles</div>
        {styles.map(style => (
          <Button theme="text" text={style.title} key={style.title} onClick={() => {}} />
        ))}
      </div>
    </Screen>
  )
}

export default Settings
