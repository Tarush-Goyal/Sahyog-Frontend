import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { AuthContext } from "../../context/auth-context";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // backgroundColor: '#2196F3'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function MainHeader() {
  const classes = useStyles();
  const auth = useContext(AuthContext);

  return (
    <div className={classes.root}>
      <AppBar position='static' style={{ backgroundColor: "#2196F3" }}>
        <Toolbar>
          <Typography variant='h4' className={classes.title}>
            SAHYOG
          </Typography>
          <Button
            color='inherit'
            onClick={() => {
              console.log(auth);
            }}>
            click me
          </Button>
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
}
