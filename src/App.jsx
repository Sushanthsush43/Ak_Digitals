// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import UploadTab from './../src/pages/UploadingTab';
import ContactPage from './pages/ContactPage';
import DashBoard from './pages/DashBoard';
import HoomePage from './pages/HomePage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/UploadingTab" exact component={UploadTab} />
        <Route path="/ContactPage" exact component={ContactPage} />
      </Switch>
    </Router>
  );
}

export default App;
