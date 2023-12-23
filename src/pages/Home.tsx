import { Link } from 'react-router-dom'

import Debug from '../kit/Debug'
import Screen from '../kit/Screen'

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg

function Settings() {
  return (
    <Screen>
      <h1 className="">monet_bot webapp</h1>
      {/* <img src={viteLogo} className="logo" alt="Vite logo" /> */}
      {/* <img src={reactLogo} className="logo react" alt="React logo" /> */}
      <div className="py-5">
      - <Link to="/settings">settings</Link>
      </div>
      <Debug isOpen={true} />
    </Screen>
  )
}

export default Settings
