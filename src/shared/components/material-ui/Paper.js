import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      // margin: theme.spacing(1),
      width: "100%",
      height: theme.spacing(10),
    },
  },
}));

const SimplePaper = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper elevation={6}>
        <Box
          style={{ width: "100%" }}
          display='flex'
          flexDirection='row'
          justifyContent='center'>
          <h1>
            <u>Active Donation Requests</u>
          </h1>
        </Box>
      </Paper>
    </div>
  );
};

export default SimplePaper;
