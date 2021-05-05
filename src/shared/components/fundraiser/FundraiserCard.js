import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import { makeStyles } from "@material-ui/core/styles";
import ErrorModal from "../../components/UIElements/ErrorModal";
import LoadingSpinner from "../../components/UIElements/LoadingSpinner";
import SimplePaper from "../../components/material-ui/SimplePaper";
import CircularStatic from "../material-ui/CircularStatic";

import Path from "../../Path";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardHeader,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import InputPrice from "./InputPrice.js";

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 345,
    margin: "25px",
  },
  media: {
    height: 200,
  },
  button: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  card: {
    minWidth: 345,
  },
}));

function FundraiserCard() {
  const [fundraisers, setFundraisers] = useState([]);
  const classes = useStyles();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        const responseData = await sendRequest(`${Path}api/fundraiser/fetch`);

        setFundraisers(responseData.fundraisers);
        console.log(responseData.fundraisers);
      } catch (err) {
        console.log("error:" + err);
      }
    };
    fetchFundraisers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      <SimplePaper title='Active Fundraisers'></SimplePaper>
      {!isLoading && fundraisers && (
        <Box
          display='flex'
          flexWrap='wrap'
          justifyContent='center'
          alignItems='flex-start'
          m={3}>
          {fundraisers.map((fundraiser, i) => (
            <Card className={classes.card}>
              <CardHeader
                style={{ textAlign: "center" }}
                title={fundraiser.title} //name
              />
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={`${Path}api/uploads/singleimage/${fundraiser.imageGrid}`}
                />
                <CardContent>
                  <Box display='flex' flexDirection='column'>
                    <Box
                      display='flex'
                      flexDirection='row'
                      justifyContent='space-around'>
                      <Typography
                        variant='body2'
                        color='inherit'
                        component='p'
                        style={{ margin: "1rem" }}>
                        {fundraiser.desc}
                      </Typography>
                    </Box>
                    <Box
                      display='flex'
                      flexDirection='row'
                      justifyContent='space-around'>
                      <CircularStatic
                        goal={fundraiser.goal}
                        goalReached={fundraiser.goalReached}></CircularStatic>
                    </Box>
                  </Box>
                </CardContent>
                <InputPrice fundraiser={fundraiser} key={i} />
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}
    </>
  );
}
export default FundraiserCard;
