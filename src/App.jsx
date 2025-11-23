import { Route, Switch } from 'wouter'
import Home from './pages/Home'
import Version1 from './versions/Version1'
import Version2 from './versions/Version2'
import Version4 from './versions/Version4'
import './index.css'

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/v1" component={Version1} />
      <Route path="/v2" component={Version2} />
      <Route path="/v4" component={Version4} />

      {/* Fallback */}
      <Route>
        <Home />
      </Route>
    </Switch>
  )
}

export default App
