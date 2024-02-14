import { create } from 'zustand'

import { STYLES_TITLED, RATIOS_TITLED } from '../const'
import { TSettings } from '../types'

type TStore = {
  generationId: undefined | string
  setGenerationId: (generationId: string) => void

  settings: undefined | TSettings
  setSettings: (settings: TSettings) => void
  resetSettings: () => void

  overlays: number[]
  setOverlays: (val: number[]) => void
  postError: null | Error
  setPostError: (postError: null | Error) => void
}

const DEFAULT_SETTINGS: TSettings = {
  style: STYLES_TITLED[0].value,
  aspect_ratio: RATIOS_TITLED[0].value,
  negative_prompt: ''
}

export const useStore = create<TStore>((set/*, get*/) => ({
  generationId: undefined,
  setGenerationId: (generationId) => set(({ generationId })),

  settings: undefined,
  setSettings: (settings) => set(({ settings })),
  resetSettings: () => set(({ settings: DEFAULT_SETTINGS })),

  overlays: [],
  setOverlays: (overlays) => set(({ overlays })),
  postError: null,
  setPostError: (postError) => set(({ postError })),
}))
