import { Link } from 'react-router-dom'

import Header from '../kit/Header'
import Screen from '../kit/Screen'

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg

function Home() {
  return (
    <Screen>
      <Header onBack={() => { history.back() }} />

      <h1>monet_bot webapp</h1>
      {/* <img src={viteLogo} className="logo" alt="Vite logo" /> */}
      {/* <img src={reactLogo} className="logo react" alt="React logo" /> */}
      <div className="py-5">
        {
          [
            ['/settings', 'Settings'],
            ['/edits', 'Edits'],
            ['/add-replace', 'Add&Replace'],
            ['/erase', 'Erase'],
            ['/outfit', 'Outfit'],
            ['/uncrop', 'Uncrop'],
          ].map(link => (
            <div>
              <span>- </span>
              <Link to={link[0]} className="text-accent">{link[1]}</Link>
            </div>
          ))
        }
      </div>
    </Screen>
  )
}

export default Home
