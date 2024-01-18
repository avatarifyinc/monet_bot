import { createHashRouter } from 'react-router-dom'

import Home from './pages/Home'
import Edits from './pages/Edits'
import AddReplace from './pages/AddReplace'
import Settings from './pages/Settings'
import Uncrop from './pages/Uncrop'
import Outfit from './pages/Outfit'

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
    path: "/edits",
    element: <Edits />,
  },
  {
    path: "/add-replace",
    element: <AddReplace />,
  },
  {
    path: "/erase",
    element: <AddReplace mode="ERASE" />,
  },
  {
    path: "/outfit",
    element: <Outfit />,
  },
  {
    path: "/uncrop",
    element: <Uncrop />,
  },
])
