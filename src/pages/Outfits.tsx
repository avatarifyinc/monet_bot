import Header from '../kit/Header'
import New from '../kit/New'
import Screen from '../kit/Screen'

import { useGetOutfits } from '../api'

function Outfits() {
  const {
    /* isLoading: isOutfitsLoading, error: outfitsError, */ // todo: error screen
    data: outfits
  } = useGetOutfits()

  return (
    <Screen>
      <Header onBack={() => { history.back() }} />

      <h4 className="">Chose the style</h4>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {outfits?.map(outfit => (
          <div className="relative bg-oslo/[0.08] rounded-[12px] pb-[127%] bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${outfit.imageURL})` }}>
            {outfit.isNew && (
              <New />
            )}
            <div className="absolute bottom-0 w-full p-3 pt-5 text-[15px] leading-5 font-semibold text-white bg-gradient-to-b from-transparent to-oslo">{outfit.name}</div>
          </div>
        ))}
      </div>
    </Screen>
  )
}

export default Outfits
