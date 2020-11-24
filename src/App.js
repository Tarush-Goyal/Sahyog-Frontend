import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Donations from "./user/pages/Donations";
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import SimpleTabs from "./shared/components/material-ui/SimpleTabs";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

const App = () => {
  const { token, login, logout, userId, type } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path='/' exact>
          <Users />
        </Route>
        <Route path='/:userId/places' exact>
          <UserPlaces />
        </Route>
        <Route path='/places/new' exact>
          <NewPlace />
        </Route>
        <Route path='/places/:placeId'>
          <UpdatePlace />
        </Route>
        <Redirect to='/' />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path='/' exact>
          {/* <Users /> */}
          {/* <Auth /> */}
          <SimpleTabs></SimpleTabs>
        </Route>
        <Route path='/:userId/places' exact>
          <UserPlaces />
        </Route>
        <Route path='/auth'>
          {/* <Auth /> */}
          <SimpleTabs></SimpleTabs>
        </Route>
        <Route path='/donations'>
          <Donations></Donations>
        </Route>
        <Redirect to='/auth' />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        type: type,
        login: login,
        logout: logout,
      }}>
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
