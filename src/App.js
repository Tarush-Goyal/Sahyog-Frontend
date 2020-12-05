import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import DonationsTable from "./volunteer/components/DonationsTable";
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
import Leaderboard from "./user/pages/Leaderboard";
import Inventory from "./ngoHead/pages/Inventory";
import Status from "./user/pages/Status";
import DonationsStatus from "./volunteer/pages/DonationsStatus";
import VolunteerLeaderboard from "./volunteer/pages/VolunteerLeaderboard";

const App = () => {
  const { token, login, logout, userId, type } = useAuth();

  let routes;

  if (token && type === "homeowner") {
    routes = (
      <Switch>
        <Route path='/donations' exact>
          <Donations></Donations>
        </Route>
        <Route path='/leaderboard' exact>
          {/* <h1>leaderboard</h1> */}
          <Leaderboard></Leaderboard>
        </Route>

        {/* <Route path='/users' exact>
          <Users />
        </Route> */}

        <Route path='/status/:id' exact>
          <Status></Status>
        </Route>

        <Redirect to='/leaderboard' />
      </Switch>
    );
  } else if (token && type === "head") {
    routes = (
      <Switch>
        <Route path='/inventory/:id' exact>
          {/* <h1>inventory</h1> */}
          <Inventory></Inventory>
        </Route>
        <Route path='/volunteers' exact>
          <h1>volunteers</h1>
        </Route>
        <Redirect to='/inventory' />
      </Switch>
    );
  }

  if (token && type === "volunteer") {
    routes = (
      <Switch>
        <Route path='/requests' exact>
          <DonationsTable></DonationsTable>
        </Route>
        <Route path='/status/:id' exact>
          <DonationsStatus></DonationsStatus>
        </Route>
        <Route path='/leaderboard/:id' exact>
          <VolunteerLeaderboard></VolunteerLeaderboard>
          {/* <h1>leaderboard</h1> */}
        </Route>
        <Redirect to='/requests' />
      </Switch>
    );
  } else if (!token) {
    routes = (
      <Switch>
        <Route path='/auth' exact>
          <SimpleTabs></SimpleTabs>
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
