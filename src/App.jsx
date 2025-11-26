import { Route, Switch } from 'wouter'
import Home from './pages/Home'
import Version2 from './versions/Version2'
import Version4 from './versions/Version4'
import Version7 from './versions/Version7';
import VersionOpusTest from './versions/VersionOpusTest';
import VersionShowcase from './versions/VersionShowcase';
import VersionHouse from './versions/VersionHouse'
import './index.css'

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/v2" component={Version2} />
      <Route path="/v4" component={Version4} />
      <Route path="/v7" component={Version7} />
      <Route path="/opus" component={VersionOpusTest} />
      <Route path="/showcase" component={VersionShowcase} />
      <Route path="/house" component={VersionHouse} />

      {/* Fallback */}
      <Route>404 Not Found</Route>
    </Switch>
  )
}

export default App
