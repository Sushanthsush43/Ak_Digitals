// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import HomePage from './pages/HomePage';
import PhotoVideoTab from './../src/components/PhotoVideoTab';
import ContactPage from './pages/ContactPage';
import DashBoard from './pages/DashBoard';


function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/PhotoVideoTab" exact component={PhotoVideoTab} />
        <Route path="/ContactPage" exact component={ContactPage} />
      </Switch>
    </Router>
  );
}

export default App;
