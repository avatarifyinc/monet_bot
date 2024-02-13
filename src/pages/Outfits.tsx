import { useHapticFeedback, useWebApp } from '@vkruglikov/react-telegram-web-app'
import { useState } from 'react'

import Header from '../kit/Header'
import New from '../kit/New'
import Screen from '../kit/Screen'

import { useGetOutfits, usePostOutfit } from '../api'
import { useStore } from '../store'
import { TOutfit } from '../types'

function Outfits() {
  const WebApp = useWebApp()
  const [, notificationOccurred] = useHapticFeedback()

  const {
    /* isLoading: isOutfitsLoading, error: outfitsError, */
    // todo: loader
    // todo: error screen
    data: outfits
  } = useGetOutfits()

  const { setPostError } = useStore()
  const [isBusy, setIsBusy] = useState(false)

  const postOutfit = usePostOutfit()

  const save = async (outfit: TOutfit) => {
    setIsBusy(true)
    try {
      const resJson = await postOutfit(outfit)
      console.log('postOutfit res', resJson)
      notificationOccurred('success')
      setTimeout(() => {
        window.Telegram?.WebApp.close()
        WebApp.close()
      }, 100)
    } catch (e) {
      setPostError(e as Error)
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <Screen>
      <Header onBack={() => { history.back() }} />

      <h4 className="">Chose the style</h4>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {outfits?.map(outfit => (
          <button /* todo: Button */
            className="relative bg-oslo/[0.08] rounded-[12px] pb-[127%] bg-cover bg-center overflow-hidden hover:brightness-110 active:scale-[95%] transition-all"
            style={{ backgroundImage: `url(${outfit.imageURL})` }}
            onClick={isBusy ? () => {} : () => { save(outfit) }}
          >
            {outfit.isNew && (
              <New />
            )}
            <div className="absolute bottom-0 w-full p-3 pt-5 text-[15px] leading-5 font-semibold text-white bg-gradient-to-b from-transparent to-oslo">{outfit.name}</div>
          </button>
        ))}
      </div>
    </Screen>
  )
}

export default Outfits
