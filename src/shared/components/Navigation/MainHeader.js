import React, { useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import Box from "@material-ui/core/Box";
import VolunteerRequests from "../../../ngoHead/components/VolunteerRequests";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const MainHeader = () => {
  let history = useHistory();
  const classes = useStyles();
  const auth = useContext(AuthContext);

  const navigateTo = (path) => {
    history.push(path);
  };

  return (
    <div className={classes.root}>
      <AppBar position='static' style={{ backgroundColor: "#2196F3" }}>
        <Toolbar>
          <Typography variant='h4' className={classes.title}>
            SAHYOG
          </Typography>
          {auth.type==='admin' && (
            <Box>
            <Button
              color='inherit'
              onClick={() => {
                navigateTo("/createfundraiser");
              }}>
              Create Fundraiser
            </Button>
            <Button
              color='inherit'
              onClick={() => {
                navigateTo("/fundraiser");
              }}>
              Active Fundraisers
            </Button>
            <Button
              color='inherit'
              onClick={() => {
                navigateTo("/admin");
              }}>
              Current NGOs
            </Button>
            </Box>
          )}


          {auth.type === "homeowner" && (
            <Box>
              <Button
                color='inherit'
                onClick={() => {
                  navigateTo("/createfundraiser");
                }}>
                Create Fundraiser
              </Button>
              <Button
                color='inherit'
                onClick={() => {
                  navigateTo("/fundraiser");
                }}>
                Active Fundraisers
              </Button>
              <Button
                color='inherit'
                onClick={() => {
                  navigateTo("/donations");
                }}>
                Donate
              </Button>
              <Button
                color='inherit'
                onClick={() => {
                  navigateTo("/leaderboard");
                }}>
                Leaderboard
              </Button>

              <Button
                color='inherit'
                onClick={() => {
                  navigateTo(`/status/${auth.userId}`);
                }}>
                Status of Donations
              </Button>
            </Box>
          )}
          {auth.type === "head" && auth.userId && (
            <Box display='flex' flexDirection='row'>
              <Button
                color='inherit'
                onClick={() => {
                  navigateTo("/createfundraiser");
                }}>
                Create Fundraiser
              </Button>
              <Button
                color='inherit'
                onClick={() => {
                  navigateTo("/fundraiser");
                }}>
                Active Fundraisers
              </Button>
              <VolunteerRequests id={auth.userId}></VolunteerRequests>
              <Button
                color='inherit'
                onClick={() => {
                  navigateTo(`/inventory/${auth.userId}`);
                }}>
                Inventory
              </Button>
              <Button
                color='inherit'
                onClick={() => {
                  navigateTo(`/volunteers/${auth.userId}`);
                }}>
                Volunteers
              </Button>
            </Box>
          )}
          {auth.type === "volunteer" && auth.userId && (
            <Box>
              <Button
                color='inherit'
                onClick={() => {
                  navigateTo("/createfundraiser");
                }}>
                Create Fundraiser
              </Button>
              <Button
                color='inherit'
                onClick={() => {
                  navigateTo("/fundraiser");
                }}>
                Active Fundraisers
              </Button>
              <Button
                color='inherit'
                onClick={() => {
                  navigateTo(`/requests/${auth.userId}`);
                }}>
                Active Requests
              </Button>
              <Button
                color='inherit'
                onClick={() => {
                  navigateTo(`/leaderboard/${auth.userId}`);
                }}>
                Leaderboard
              </Button>
              <Button
                color='inherit'
                onClick={() => {
                  navigateTo(`/status/${auth.userId}`);
                }}>
                Status of Donations
              </Button>
            </Box>
          )}
          {!auth.isLoggedIn && <Button color='inherit'>Login</Button>}
          {auth.isLoggedIn && (
            <Button color='inherit' onClick={auth.logout}>
              LOGOUT
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default MainHeader;
