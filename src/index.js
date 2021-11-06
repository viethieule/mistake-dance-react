import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-widgets/styles.css';
import App from './App';
import { Router } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import sessionReducer from './store/reducers/session'
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

export const history = createBrowserHistory();

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const store = createStore(sessionReducer, composeEnhancers(
  applyMiddleware(thunk)
))

const backup = console.error;
console.error = function filterWarnings(...msg) {
  const supressedWarnings = ['findDOMNode'];

  if (!supressedWarnings.some(entry => msg.includes(entry))) {
    backup.apply(console, arguments);
  }
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
