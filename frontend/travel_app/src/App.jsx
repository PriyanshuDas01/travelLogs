import { BrowserRouter as Router,Route,Routes,Navigate } from 'react-router-dom'
import React from 'react'

import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Home from './pages/Home/Home'

const routes = (
  <Router>
    <Routes>
      <Route path="/" exact element={<Home />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/signup" exact element={<Signup />} />
    </Routes>
  </Router>
);

function App() {
  return (
    <div>
      {routes}
    </div>
  )
}

export default App