import { createHashRouter, RouterProvider } from 'react-router-dom'

import Home from './pages/Home'
import Settings from './pages/Settings'

import './App.css'

function App() {
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
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
