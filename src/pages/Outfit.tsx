import Screen from '../kit/Screen'

import outfitBdsm from '../assets/outfit-bdsm.jpg'
import outfitHaircut from '../assets/outfit-haircut.jpg'
import outfitBodybuilder from '../assets/outfit-bodybuilder.jpg'
import outfitLatex from '../assets/outfit-latex.jpg'
import outfitBusiness from '../assets/outfit-business.jpg'
import outfitSexy from '../assets/outfit-sexy.jpg'
import outfitSuperman from '../assets/outfit-superman.jpg'
import outfitSkeleton from '../assets/outfit-skeleton.jpg'

function Outfit() {
  const outfits = [
    { text: 'BDSM', img: outfitBdsm },
    { text: 'Haircut', img: outfitHaircut },
    { text: 'Body Builder', img: outfitBodybuilder },
    { text: 'Latex', img: outfitLatex },
    { text: 'Business Unit', img: outfitBusiness },
    { text: 'Sexy', img: outfitSexy },
    { text: 'Superman', img: outfitSuperman },
    { text: 'Skeleton', img: outfitSkeleton },
  ]
  return (
    <Screen>
      <h4 className="">Chose the style</h4>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {outfits.map(outfit => (
          <div className="bg-oslo/[0.08] rounded-[12px] pb-[127%] relative bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${outfit.img})` }}>
            <div className="absolute bottom-0 w-full p-3 pt-5 text-[15px] leading-5 font-semibold text-white bg-gradient-to-b from-transparent to-oslo">{outfit.text}</div>
          </div>
        ))}
      </div>
    </Screen>
  )
}

export default Outfit
