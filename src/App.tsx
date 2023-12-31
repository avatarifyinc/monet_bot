import cx from 'classnames'
import { useEffect } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { useExpand, WebAppProvider } from '@vkruglikov/react-telegram-web-app';

import Home from './pages/Home'
import Edits from './pages/Edits'
import AddReplace from './pages/AddReplace'
import Settings from './pages/Settings'
import Uncrop from './pages/Uncrop'
import Outfit from './pages/Outfit'

import { useTheme } from './hooks/useTheme'

function App() {
  const { isDarkTheme } = useTheme()

  const [isExpanded, expand] = useExpand()
  useEffect(() => {
    if (!isExpanded) {
      expand()
    }
  }, [])

  const router = createHashRouter([
    {
      path: "/",
      element: (
        <Home />
      ),
      errorElement: (
        <Home />
      ),
    },
    {
      path: "*",
      element: (
        <Home />
      ),
    },
    {
      path: "/settings",
      element: (
        <Settings />
      ),
    },
    {
      path: "/edits",
      element: (
        <Edits />
      ),
    },
    {
      path: "/add-replace",
      element: (
        <AddReplace />
      ),
    },
    {
      path: "/outfit",
      element: (
        <Outfit />
      ),
    },
    {
      path: "/uncrop",
      element: (
        <Uncrop />
      ),
    },
  ])

  return (
    <WebAppProvider
      options={{
        smoothButtonsTransition: true
      }}
    >
      <div className={cx(isDarkTheme ? 'theme-dark dark' : 'theme-light')}>
        <RouterProvider router={router} />
      </div>
    </WebAppProvider>
  )
}

export default App
