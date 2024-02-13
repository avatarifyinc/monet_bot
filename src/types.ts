import { STYLES, RATIOS } from './const'

export type TStyle = typeof STYLES[number]

export type TRatio = typeof RATIOS[number]

export type TSettings = {
  style: TStyle
  aspect_ratio: TRatio
  negative_prompt: string
}

export type TOutfit = {
  name: string
  imageURL: string
  preset: string
  isPremium: boolean
  isNew?: boolean // todo
}
