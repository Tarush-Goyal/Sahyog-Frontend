import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { makeStyles } from "@material-ui/core/styles";
import Card2 from "../../shared/components/UIElements/Card";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import "./Login.css";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
// import Typography from "@material-ui/core/Typography";
// import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
// import Button from "@material-ui/core/Button";
import { AuthContext } from "../../shared/context/auth-context";

// const useStyles = makeStyles((theme) => ({
//   root: {},
//   media: {
//     height: 800,
//     // width5 "20%",
//     width: "20rem",
//     overflow: "hidden",
//   },
// }));

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

const Donations = () => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <div className={classes.root}>
        <AppBar position='static' style={{ backgroundColor: "#155724" }}>
          <Toolbar style={{ width: "100%" }}>
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='space-around'
              style={{ width: "100%" }}>
              <Typography
                variant='h6'
                className={classes.title}
                style={{ width: "45%" }}></Typography>
              <Typography
                variant='h6'
                className={classes.title}
                style={{ width: "55%" }}>
                Sharing is Caring
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
        <Box display='flex' flexDirection='row' style={{ width: "100%" }}>
          <Card style={{ width: "20%" }}>
            {/* <CardActionArea> */}
            <CardMedia
              style={{
                height: 800,
                width: "100%",
                // width: "20rem",
                // overflow: "hidden",
              }}
              // className={classes.media}
              // image='https://images.unsplash.com/photo-1529736576495-1ed4a29ca7e1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1576&q=80'
              // image='https://static.toiimg.com/thumb/msid-74809154,width-1200,height-900,resizemode-4/.jpg'
              title='Contemplative Reptile'>
              <img src='https://static.toiimg.com/thumb/msid-74809154,width-1200,height-900,resizemode-4/.jpg' />
            </CardMedia>
            {/* </CardActionArea> */}
          </Card>
          <Card style={{ width: "60%" }}></Card>
          <Card style={{ width: "20%" }}>
            {/* <CardActionArea> */}
            <CardMedia
              style={{
                height: 800,
                width: "100%",
                // width: "20rem",
                // overflow: "hidden",
              }}
              // className={classes.media}
              // image='https://i.pinimg.com/originals/7c/12/aa/7c12aaed4dc949c7c838b2fc861b507b.png'
              title='Contemplative Reptile'>
              <img src='https://i.pinimg.com/originals/7c/12/aa/7c12aaed4dc949c7c838b2fc861b507b.png' />
            </CardMedia>
            {/* </CardActionArea> */}
          </Card>
        </Box>
      </div>
    </React.Fragment>
  );
};

export default Donations;
