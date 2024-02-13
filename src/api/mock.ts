import { TSettings, TOutfit } from '../types'

import outfitBdsm from '../assets/outfit-bdsm.jpg'
import outfitHaircut from '../assets/outfit-haircut.jpg'
import outfitBodybuilder from '../assets/outfit-bodybuilder.jpg'
import outfitLatex from '../assets/outfit-latex.jpg'
import outfitBusiness from '../assets/outfit-business.jpg'
import outfitSexy from '../assets/outfit-sexy.jpg'
import outfitSuperman from '../assets/outfit-superman.jpg'
import outfitSkeleton from '../assets/outfit-skeleton.jpg'

export const mockSettings: TSettings = {
  style: 'analog film',
  aspect_ratio: [4, 3],
  negative_prompt: 'extra fingers'
}

export const mockOutfits: TOutfit[] = [
  { name: 'BDSM', preset: 'BDSM', imageURL: outfitBdsm, isPremium: false },
  { name: 'Haircut', preset: 'Haircut', imageURL: outfitHaircut, isPremium: false, isNew: true },
  { name: 'Body Builder', preset: 'Body Builder', imageURL: outfitBodybuilder, isPremium: false },
  { name: 'Latex', preset: 'Latex', imageURL: outfitLatex, isPremium: false },
  { name: 'Business Unit', preset: 'Business Unit', imageURL: outfitBusiness, isPremium: false },
  { name: 'Sexy', preset: 'Sexy', imageURL: outfitSexy, isPremium: false },
  { name: 'Superman', preset: 'Superman', imageURL: outfitSuperman, isPremium: false },
  { name: 'Skeleton', preset: 'Skeleton', imageURL: outfitSkeleton, isPremium: false },
]
