import './App.css';
import 'semantic-ui-css/semantic.min.css'
import Layout from './containers/Layout/Layout';
import { Redirect, Route, Switch } from 'react-router-dom';
import FilterableCalendar from './containers/FilterableCalendar/FilterableCalendar';
import LoginForm from './containers/LoginForm/LoginForm';
import SessionDetail from './containers/FilterableCalendar/SessionDetail/SessionDetail';

function App() {
  return (
    <Layout>
      <Switch>
        <Route path={["/", "/sessions/:id"]} exact component={FilterableCalendar}></Route>
        <Route path="/login" component={LoginForm}></Route>
        <Redirect to="/"></Redirect>
      </Switch>

      <Route path="/sessions/:id" component={SessionDetail}/>
    </Layout>
  );
}

export default App;
