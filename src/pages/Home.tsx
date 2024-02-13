import { useWebApp } from '@vkruglikov/react-telegram-web-app';

import { useNavigate } from 'react-router-dom'

import Header from '../kit/Header'
import Screen from '../kit/Screen'
import New from '../kit/New'

import editAddreplace from '../assets/edit-addreplace.jpg'
import editOutfits from '../assets/edit-outfits.jpg'
import editUpscale from '../assets/edit-upscale.jpg'
import editEraser from '../assets/edit-eraser.jpg'
import editUncrop from '../assets/edit-uncrop.jpg'

import coverAddreplace from '../assets/cover-addreplace.mp4'
import coverEraser from '../assets/cover-eraser.mp4'
import coverGenerate from '../assets/cover-generate.mp4'
import coverOutfits from '../assets/cover-outfits.mp4'
import coverUncrop from '../assets/cover-uncrop.mp4'
import coverUpscale from '../assets/cover-upscale.mp4'

const edits = [
  { title: 'Add&Replace', img: editAddreplace, video: coverAddreplace, path: '/add-replace' },
  { title: 'AI Outfits', img: editOutfits, video: coverOutfits, path: '/outfits', isNew: true },
  { title: 'AI Upscale', img: editUpscale, video: coverUpscale, botCommand: "SELECTED_UPSCALE" },
  { title: 'Eraser', img: editEraser, video: coverEraser, path: '/eraser' },
  { title: 'Uncrop', img: editUncrop, video: coverUncrop, path: '/uncrop' },
  { title: 'Generate image', video: coverGenerate, botCommand: "SELECTED_GENERATE" },
]

function Home() {
  const WebApp = useWebApp()
  const navigate = useNavigate()

  return (
    <Screen>
      <Header onBack={() => { WebApp.close() }} />

      <div className="max-w-[500px] mx-auto">
        <h4 className="">AI Edits</h4>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {edits.map((item, i) => (
            <button
              key={i}
              className="relative bg-oslo/[0.08] rounded-[12px] bg-cover pb-[109%] bg-center overflow-hidden hover:brightness-110 active:scale-[96%] transition-all"
              // style={{ backgroundImage: `url(${item.img})`}}
              onClick={() => {
                if (item.botCommand) {
                  WebApp.sendData(item.botCommand)
                  WebApp.close()
                }
                if (item.path) {
                  navigate(item.path)
                }
              }}
            >
              {item.video && (
                <video
                  className="absolute max-w-min w-[102%] min-h-[102%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  // width="400"
                  // height="300"
                  autoPlay
                  loop
                  muted
                  controls={false}
                  /* poster={item.img} */
                >
                  <source src={item.video} type="video/mp4" />
                </video>
              )}
              {item.isNew && (
                <New />
              )}
              <div className="absolute bottom-0 w-full p-3 pt-5 text-[15px] leading-5 font-semibold text-white bg-gradient-to-b from-transparent to-oslo">
                {item.title}
              </div>
            </button>
          ))}
        </div>
      </div>
    </Screen>
  )
}

export default Home
