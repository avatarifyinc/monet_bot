import Screen from '../kit/Screen'

import editAddreplace from '../assets/edit-addreplace.jpg'
import editOutfits from '../assets/edit-outfits.jpg'
import editUpscale from '../assets/edit-upscale.jpg'
import editEraser from '../assets/edit-eraser.jpg'
import editUncrop from '../assets/edit-uncrop.jpg'

function Edits() {
  const edits = [
    { text: 'Add&Replace', img: editAddreplace },
    { text: 'AI Outfits', img: editOutfits },
    { text: 'AI Upscale', img: editUpscale },
    { text: 'Eraser', img: editEraser },
    { text: 'Uncrop', img: editUncrop },
  ]
  return (
    <Screen>
      <h4 className="">AI Edits</h4>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {edits.map(edit => (
          <div className="bg-oslo/[0.08] rounded-[12px] pb-[69%] relative bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${edit.img})` }}>
            <div className="absolute bottom-0 w-full p-3 pt-5 text-[15px] leading-5 font-semibold text-white bg-gradient-to-b from-transparent to-oslo">{edit.text}</div>
          </div>
        ))}
      </div>
    </Screen>
  )
}

export default Edits
