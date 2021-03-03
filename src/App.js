import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import DonationsTable from "./volunteer/pages/ActiveDonations";
import DonationsTemplate from "./user/pages/DonationsTemplate";
import SimpleTabs from "./user/components/SimpleTabs";
import MainHeader from "./shared/components/Navigation/MainHeader";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import UserLeaderboard from "./user/pages/Leaderboard";
import Inventory from "./ngoHead/pages/Inventory";
import Status from "./user/pages/Status";
import DonationsStatus from "./volunteer/pages/DonationsStatus";
import VolunteerLeaderboard from "./volunteer/pages/Leaderboard";
import NGOVolunteerDetails from "./ngoHead/pages/NGOVolunteerDetails";

const App = () => {
  const { token, login, logout, userId, type } = useAuth();

  let routes;

  if (token && type === "homeowner") {
    routes = (
      <Switch>
        <Route path='/donations' exact>
          <DonationsTemplate></DonationsTemplate>
        </Route>
        <Route path='/leaderboard' exact>
          <UserLeaderboard></UserLeaderboard>
        </Route>
        <Route path='/status/:id' exact>
          <Status></Status>
        </Route>
        <Redirect to='/leaderboard' />
      </Switch>
    );
  } else if (token && userId && type === "head") {
    routes = (
      <Switch>
        <Route path='/inventory/:id' exact>
          {/* <h1>inventory</h1> */}
          <Inventory></Inventory>
        </Route>
        <Route path='/volunteers/:id' exact>
          {/* <h1>volunteers</h1> */}
          <NGOVolunteerDetails></NGOVolunteerDetails>
        </Route>
        <Redirect to={"/inventory/" + userId} />
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
        <MainHeader />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
