import { create } from 'zustand'

import { STYLES_TITLED, RATIOS_TITLED } from '../const'
import { TSettings } from '../types'

type TStore = {
  settings: undefined | TSettings
  setSettings: (settings: TSettings) => void
  resetSettings: () => void
}

const DEFAULT_SETTINGS: TSettings = {
  style: STYLES_TITLED[0].value,
  aspect_ratio: RATIOS_TITLED[0].value,
  negative_prompt: ''
}

export const useStore = create<TStore>((set/*, get*/) => ({
  settings: undefined,
  setSettings: (settings) => set(({ settings })),
  resetSettings: () => set(({ settings: DEFAULT_SETTINGS }))
}))