import 'semantic-ui-css/semantic.min.css'
import './App.scss'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import AuthRoute from './util/AuthRoute'
import { AuthProvider } from './context/auth'

// import pages and components
import { Home, Login, Register } from './pages'
import { MenuBar, SinglePost } from './components'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="ui container">
          <MenuBar/>
          <Route exact path="/" component={Home}/>
          <AuthRoute exact path="/login" component={Login}/>
          <AuthRoute exact path="/register" component={Register}/>
          <Route exact path="/posts/:postId" component={SinglePost} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App
