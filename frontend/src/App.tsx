import { useEffect } from 'react'
import Routes from '~/routes'
import { setTokens, setUser } from '~/store/authSlice'
import { useDispatch } from 'react-redux'
import { Tokens, User } from '~/types/api'
import TanstackProviders from '~/TanstackProvider/provider'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Load user data from local storage on app load
    const storedUser = localStorage.getItem('user')
    const storedTokens = localStorage.getItem('tokens')

    if (storedUser && storedTokens) {
      const user: User = JSON.parse(storedUser)
      const tokens: Tokens = JSON.parse(storedTokens)

      // Set user data in Redux store
      dispatch(setUser(user))
      dispatch(setTokens(tokens))
    }
  }, [dispatch])

  return (
    <div className="App">
      <TanstackProviders>
        <Routes />
      </TanstackProviders>
    </div>
  )
}

export default App
