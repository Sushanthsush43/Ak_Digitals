// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import HomePage from './pages/HomePage';
import PhotoUpload from './components/PhotoUpload';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/PhotoUpload" exact component={PhotoUpload} />
        <Route path="/ContactPage" exact component={ContactPage} />
      </Switch>
    </Router>
  );
}

export default App;
