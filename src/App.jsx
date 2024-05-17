// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import UploadTab from './../src/pages/UploadingTab';
import ContactPage from './pages/ContactPage';
import DashBoard from './pages/DashBoard';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={DashBoard} />
        <Route path="/UploadingTab" exact component={UploadTab} />
        <Route path="/ContactPage" exact component={ContactPage} />
      </Switch>
    </Router>
  );
}

export default App;
