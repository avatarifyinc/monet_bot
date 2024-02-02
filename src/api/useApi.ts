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

export const useGetSettings = () => {
  const [, initData] = useInitData()
  const { setSettings } = useStore()

  return (
    useQuery<TSettings, Error>({
      queryKey: ['settings'],
      queryFn: (!initData /*!!'MOCK'*/)
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

export const usePostSettings = () => {
  const [, initData] = useInitData()
  const { settings } = useStore()
  const url = !initData
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/settings`

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
