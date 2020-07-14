import React, {lazy, Suspense} from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

const Layout = lazy(() => import('./Components/layout/index'));
const Login = lazy(() => import('./Components/Login.jsx'));

function App() {
  return (
    <Suspense fallback={<div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 20 }}>Loading.....</div>}>
      <Router>
        <Switch>
          <Route path='/' exact render={() => <Redirect to='/login' />} />
          <Route path='/login' component={Login} />
          <Route path='/index' component={Layout} />
        </Switch>
      </Router>
    </Suspense>
  );
}

export default App;
