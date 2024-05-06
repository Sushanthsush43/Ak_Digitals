// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


import HomePage from './components/pages/HomePage';
import ImageUploader from './components/uitls/PhotoUpload';
import ContactPage from './components/pages/ContactPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/PhotoUpload" exact component={ImageUploader} />
        <Route path="/ContactPage" exact component={ContactPage} />
      </Switch>
    </Router>
  );
}

export default App;
