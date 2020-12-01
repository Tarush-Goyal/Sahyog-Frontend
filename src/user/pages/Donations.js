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
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
// import Button from "@material-ui/core/Button";
import { AuthContext } from "../../shared/context/auth-context";
import "./Donations.css";
import DonationForm from "./DonationForm.js";

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
        <Alert icon={false} severity='success'>
          <h3>INDIA DONATES - For a Better Tomorrow</h3>
        </Alert>
        <Box display='flex' flexDirection='row' style={{ width: "100%" }}>
          <Card style={{ width: "20%" }}>
            <CardMedia
              style={{
                height: 800,
                width: "100%",
              }}
              title='Pic1'>
              <img
                style={{ height: 800 }}
                src='https://files.prokerala.com/movies/pics/800/actor-raghava-lawrence-pleads-for-help-with-childrens-education-109785.jpg'
              />
            </CardMedia>
          </Card>
          <Card style={{ width: "60%" }}>
            <DonationForm></DonationForm>
          </Card>
          <Card style={{ width: "20%" }}>
            <CardMedia
              style={{
                height: 800,
                width: "100%",
              }}
              title='Pic2'>
              <img
                style={{ height: 800 }}
                src='https://i.pinimg.com/originals/7c/12/aa/7c12aaed4dc949c7c838b2fc861b507b.png'
              />
            </CardMedia>
          </Card>
        </Box>
      </div>
    </React.Fragment>
  );
};

export default Donations;
