import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Users from './Users';

export default class App extends Component {
  render() {
    const tabs = [
      {
        title: 'Home',
        path: '/',
      },
      {
        title: 'Users',
        path: '/users',
      },
    ];
    return (
      <div>
        <h1>Acme Users</h1>
        <Router>
          <Route
            render={({ location: { pathname } }) => (
              <ul className="nav nav-tabs">
                {tabs.map(tab => (
                  <li key={tab.title} className="nav-item">
                    <Link
                      to={tab.path}
                      className={`nav-link ${
                        tab.path === pathname ? 'active' : ''
                      }`}
                    >
                      {tab.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          />
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <div>
                  <h6>User Pagging Applicaiton</h6>
                </div>
              )}
            />
            <Route exact path="/users/:index?" component={Users} />} />
            <Route path="/users/search/:searchTerm/:index?" component={Users} />
            } />
          </Switch>
        </Router>
      </div>
    );
  }
}
