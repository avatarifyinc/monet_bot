import { RouterProvider } from 'react-router-dom'
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';

import { useAutoExpand } from './hooks/useAutoExpand'
import { useTheme } from './hooks/useTheme'

import { router } from './router'

function App() {
  useAutoExpand()
  useTheme()

  return (
    <WebAppProvider options={{ smoothButtonsTransition: true }}>
      <RouterProvider router={router} />
    </WebAppProvider>
  )
}

export default App
