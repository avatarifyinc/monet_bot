import Header from '../kit/Header'
import Screen from '../kit/Screen'
import New from '../kit/New'

import editAddreplace from '../assets/edit-addreplace.jpg'
import editOutfits from '../assets/edit-outfits.jpg'
import editUpscale from '../assets/edit-upscale.jpg'
import editEraser from '../assets/edit-eraser.jpg'
import editUncrop from '../assets/edit-uncrop.jpg'

function Edits() {
  const edits = [
    { text: 'Add&Replace', img: editAddreplace },
    { text: 'AI Outfits', img: editOutfits, isNew: true },
    { text: 'AI Upscale', img: editUpscale },
    { text: 'Eraser', img: editEraser },
    { text: 'Uncrop', img: editUncrop },
  ]
  return (
    <Screen>
      <Header onBack={() => { history.back() }} />

      <h4 className="">AI Edits</h4>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {edits.map(edit => (
          <div className="relative bg-oslo/[0.08] rounded-[12px] pb-[69%] bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${edit.img})` }}>
            {edit.isNew && (
              <New />
            )}
            <div className="absolute bottom-0 w-full p-3 pt-5 text-[15px] leading-5 font-semibold text-white bg-gradient-to-b from-transparent to-oslo">{edit.text}</div>
          </div>
        ))}
      </div>
    </Screen>
  )
}

export default Edits
