import { create } from 'zustand'

import { STYLES, RATIOS } from '../const'
import { TSettings } from '../types'

type TStore = {
  settings: undefined | TSettings
  setSettings: (settings: TSettings) => void
}

const DEFAULT_SETTINGS: TSettings = {
  style: STYLES[0],
  aspect_ratio: RATIOS[0],
  negative_prompt: ''
}

export const useStore = create<TStore>((set/*, get*/) => ({
  settings: undefined,
  setSettings: (settings) => set(({ settings })),
  resetSettings: () => set(({ settings: DEFAULT_SETTINGS }))
}))
