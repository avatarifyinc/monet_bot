import Button from '../kit/Button'
import Screen from '../kit/Screen'

function Settings() {
  return (
    <Screen>
      <div className="flex items-center justify-between">
        <h4>Settings</h4>
        <Button theme="text" text="Reset" onClick={() => {}}></Button>
      </div>
      <div className="mt-6">
      ...
      </div>
    </Screen>
  )
}

export default Settings
