import Header from '../kit/Header'
import Screen from '../kit/Screen'
import New from '../kit/New'

import editAddreplace from '../assets/edit-addreplace.jpg'
import editOutfits from '../assets/edit-outfits.jpg'
import editUpscale from '../assets/edit-upscale.jpg'
import editEraser from '../assets/edit-eraser.jpg'
import editUncrop from '../assets/edit-uncrop.jpg'

function Home() {
  const edits = [
    { title: 'Add&Replace', img: editAddreplace, path: '/add-replace' },
    { title: 'AI Outfits', img: editOutfits, path: '/outfits', isNew: true },
    { title: 'AI Upscale', img: editUpscale, botCommand: "UPSCALE" },
    { title: 'Eraser', img: editEraser, path: '/eraser' },
    { title: 'Uncrop', img: editUncrop, path: '/uncrop' },
    { title: 'Generate image', botCommand: "GENERATE" },
  ]
  return (
    <Screen>
      <Header onBack={() => { history.back() }} />

      <div className="max-w-[500px] mx-auto">
        <h4 className="">AI Edits</h4>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {edits.map(item => (
            <div className="relative bg-oslo/[0.08] rounded-[12px] pb-[109%] bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${item.img})` }}>
              {item.isNew && (
                <New />
              )}
              <div className="absolute bottom-0 w-full p-3 pt-5 text-[15px] leading-5 font-semibold text-white bg-gradient-to-b from-transparent to-oslo">{item.title}</div>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  )
}

export default Home
