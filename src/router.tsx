import { createHashRouter } from 'react-router-dom'

import Home from './pages/Home'
import AddReplace from './pages/AddReplace'
import Settings from './pages/Settings'
import Uncrop from './pages/Uncrop'
import Outfits from './pages/Outfits'

export const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Home />,
  },
  {
    path: "*",
    element: <Home />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/add-replace",
    element: <AddReplace />,
  },
  {
    path: "/eraser",
    element: <AddReplace mode="ERASE" />,
  },
  {
    path: "/outfits",
    element: <Outfits />,
  },
  {
    path: "/uncrop",
    element: <Uncrop />,
  },
])
