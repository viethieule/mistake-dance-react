import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-widgets/styles.css';
import App from './App';
import { Router } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

const backup = console.error;

console.error = function filterWarnings(...msg) {
  const supressedWarnings = ['findDOMNode'];

  if (!supressedWarnings.some(entry => msg.includes(entry))) {
    backup.apply(console, arguments);
  }
};

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
