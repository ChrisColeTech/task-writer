import Layout from './components/layout/Layout'
import { ErrorProvider } from './contexts/ErrorContext'

function App() {
  return (
    <ErrorProvider>
      <Layout />
    </ErrorProvider>
  )
}

export default App
