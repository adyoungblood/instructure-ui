import { Button, InstUISettingsProvider, View, canvasDarkMode} from '@instructure/ui'

function App() {
  return (
    <InstUISettingsProvider theme={canvasDarkMode}>
      <View display="block" padding="medium" background="success">
        <Button>Hello from InstUI!</Button>
      </View>
    </InstUISettingsProvider>
  )
}

export default App
