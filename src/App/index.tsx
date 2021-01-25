import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Register } from '../components/Register';
import { Login } from '../components/Login';
import { SquareColorStart } from '../components/Training';
import { UserProvider } from '../components/Firebase';
import styles from './App.module.css';

import * as ROUTES from '../constants/routes';

export default function App() {
  return (
    <UserProvider>
      <HashRouter>
        <div className={styles.Container}>
          <Switch>
            <Route exact path={ROUTES.LOG_IN} component={Login} />
            <Route exact path={ROUTES.SIGN_UP} component={Register} />
            <Route
              exact
              path={ROUTES.SQUARECOLORS}
              component={SquareColorStart}
            />
            <Route>
              <h1 className={styles.error}>PAGE NOT FOUND</h1>
            </Route>
          </Switch>
        </div>
      </HashRouter>
    </UserProvider>
  );
}
