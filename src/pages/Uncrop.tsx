import Button from '../kit/Button'
import Header from '../kit/Header'
import Screen from '../kit/Screen'

function Uncrop() {
  return (
    <Screen>
      <Header onBack={() => { history.back() }} />

      Uncrop soon...

      <Button
        isBottom
        text="Generate"
        onClick={() => {}}
        // disabled={isButtonDisabled}
        // isBusy={isBusy}
      />
    </Screen>
  )
}

export default Uncrop
