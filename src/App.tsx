import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';

import { RouterProvider } from 'react-router-dom'

import { useAutoExpand } from './hooks/useAutoExpand'
import { useTheme } from './hooks/useTheme'

import DemoMode from './kit/DemoMode'

import { router } from './router'

const queryClient = new QueryClient()

function App() {
  useAutoExpand()
  useTheme()

  return (
    <WebAppProvider options={{ smoothButtonsTransition: true }}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <DemoMode />
      </QueryClientProvider>
    </WebAppProvider>
  )
}

export default App
