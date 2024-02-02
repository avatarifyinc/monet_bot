import { useInitData } from '@vkruglikov/react-telegram-web-app'
import { useQuery } from '@tanstack/react-query'

import { useStore } from '../store'
import { TSettings } from '../types'

import { mockSettings } from './mock'

const apiUrl = import.meta.env.VITE_API_URL
const staleTime = 5 * 60 * 1000

const handleJsonResponse = (res: any) => {
  if (!res.ok) {
    throw new Error(`Backend ${res.status}`);
  }
  return res.json()
}

export const useSettingsQuery = () => {
  const [, initData] = useInitData()
  const { setSettings } = useStore()

  return (
    useQuery<TSettings, Error>({
      queryKey: ['settings'],
      queryFn: !!'MOCK'
        ? () => mockSettings
        : () =>
          fetch(`${apiUrl}/settings`, {
            headers: {
              'X-TG-INIT-DATA': initData || '',
            }
          }).then(handleJsonResponse),
      onSuccess: (data) => {
        console.log('useApi: settings', data)
        setSettings(data)
      },
      staleTime
    })
  )
}
