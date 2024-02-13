import { useGetSettings, useGetOutfits } from '../api'
import { useStore } from '../store'

export const useSplash = () => {
  const { isLoading: isSettingsLoading, error: settingsError } = useGetSettings()
  const { isLoading: isOutfitsLoading, error: outfitsError } = useGetOutfits()

  const isLoading = isSettingsLoading || isOutfitsLoading

  const { postError } = useStore()

  const error = settingsError || outfitsError || postError

  return { isLoading, error }
}
