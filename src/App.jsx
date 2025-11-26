import { Route, Switch } from 'wouter'
import Home from './pages/Home'
import Version1 from './versions/Version1'
import Version2 from './versions/Version2'
import Version4 from './versions/Version4'
import Version6 from './versions/Version6'
import Version7 from './versions/Version7';
import VersionShowcase from './versions/VersionShowcase';
import VersionHouse from './versions/VersionHouse'
import './index.css'

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/v1" component={Version1} />
      <Route path="/v2" component={Version2} />
      <Route path="/v4" component={Version4} />
      <Route path="/v6" component={Version6} />
      <Route path="/v7" component={Version7} />
      <Route path="/showcase" component={VersionShowcase} />
      <Route path="/house" component={VersionHouse} />

      {/* Fallback */}
      <Route>
        <Home />
      </Route>
    </Switch>
  )
}

export default App
