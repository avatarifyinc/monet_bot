import { useInitData } from '@vkruglikov/react-telegram-web-app'
import { useQuery } from '@tanstack/react-query'

import { useStore } from '../store'
import { TSettings, TOutfit } from '../types'

import { mockSettings, mockOutfits } from './mock'

const apiUrl = import.meta.env.VITE_API_URL
const staleTime = 5 * 60 * 1000

const handleJsonResponse = (res: Response) => {
  if (!res.ok) {
    throw new Error(`Backend ${res.status}`);
  }
  if (res.status !== 204) {
    return res.json()
  }
}

export const useGetSettings = () => {
  const [, initData] = useInitData()
  const { setSettings } = useStore()
  return (
    useQuery<TSettings, Error>({
      queryKey: ['settings'],
      queryFn: (!initData /*!!'MOCK'*/)
        ? () => mockSettings
        : () =>
          fetch(`${apiUrl}/endpoints/settings`, {
            headers: {
              'X-TG-INIT-DATA': initData || '',
            }
          }).then(handleJsonResponse),
      onSuccess: (data) => {
        console.log('useGetSettings', data)
        setSettings(data)
      },
      staleTime
    })
  )
}

export const usePostSettings = () => {
  const [, initData] = useInitData()
  const { settings } = useStore()
  const url = !initData
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/endpoints/settings`
  return () =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(settings),
      headers: {
        'Content-type': 'application/json',
        'X-TG-INIT-DATA': initData || '',
      },
    }).then(handleJsonResponse)
}

export const useGetOutfits = () => {
  const [, initData] = useInitData()
  return (
    useQuery<TOutfit[], Error>({
      queryKey: ['outfits'],
      queryFn: (!initData /*!!'MOCK'*/)
        ? () => mockOutfits
        : () =>
          fetch(`${apiUrl}/outfits`, {
            headers: {
              'X-TG-INIT-DATA': initData || '',
            }
          }).then(handleJsonResponse)
          .then(json => json.costumes),
      onSuccess: (data) => {
        console.log('useGetOutfits', data)
      },
      staleTime
    })
  )
}

export const usePostOutfit = () => {
  const [, initData] = useInitData()
  const url = !initData
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/outfits`
  return (data: {
    generation_id: string,
    preset: string
  }) =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json',
        'X-TG-INIT-DATA': initData || '',
      },
    }).then(handleJsonResponse)
}
