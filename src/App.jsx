import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import DashBoard from './pages/DashBoard';
import AboutUs from './components/AboutUs';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/dashboard" exact component={DashBoard} />
        <Route path="/contactpage" exact component={AboutUs} />
      </Switch>
    </Router>
  );
}

export default App;
