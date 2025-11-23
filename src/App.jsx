import { Route, Switch } from 'wouter'
import Home from './pages/Home'
import Version1 from './versions/Version1'
import Version2 from './versions/Version2' // We'll create this next
import './index.css'

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/v1" component={Version1} />
      <Route path="/v2" component={Version2} />

      {/* Fallback */}
      <Route>
        <Home />
      </Route>
    </Switch>
  )
}

export default App
