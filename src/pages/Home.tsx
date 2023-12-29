import { Link } from 'react-router-dom'

import Debug from '../kit/Debug'
import Screen from '../kit/Screen'

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg

function Home() {
  return (
    <Screen>
      <h1>monet_bot webapp</h1>
      {/* <img src={viteLogo} className="logo" alt="Vite logo" /> */}
      {/* <img src={reactLogo} className="logo react" alt="React logo" /> */}
      <div className="py-5">
        <div>
          <span>- </span>
          <Link to="/settings">Settings</Link>
        </div>
        <div>
          <span>- </span>
          <Link to="/edits">Edits</Link>
        </div>
        <div>
          <span>- </span>
          <Link to="/add-replace">Add&Replace</Link>
        </div>
        <div>
          <span>- </span>
          <Link to="/outfit">Outfit</Link>
        </div>
        <div>
          <span>- </span>
          <Link to="/uncrop">Uncrop</Link>
        </div>
      </div>
      <Debug isOpen={true} />
    </Screen>
  )
}

export default Home
