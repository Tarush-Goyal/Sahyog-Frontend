import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import Avatar from "../../shared/components/UIElements/Avatar";
import Path from "../../shared/Path";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { useHttpClient } from "../../shared/hooks/http-hook";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SimplePaper from "../../shared/components/material-ui/SimplePaper";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
// import {useHttpClient} from "../../shared/hooks/http-hook";
import {useLocation, useParams} from "react-router-dom";

const NGODetails = () => {
  const useStyles = makeStyles(theme => ({
    root: {
      width: "20rem",
      height: "20rem"
    },

    list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor:  "#f5f5f5",
  },
  }));

  const defaultProps = {
    bgcolor: "background.paper",
    borderColor: "text.primary",
    m: 1,
    border: 1,
    style: {width: "20rem", height: "20rem"}
  };

  const classes = useStyles();
  let location = useLocation;
  // const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const id = useParams().id;
  const [donationItem, setItem] = useState();
  const [ngo, setNgo] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchNGODetails = async () => {
      try {
        const responseData = await sendRequest(
          `${Path}api/admin/getNGODetails/${id}`
        );
         setNgo(responseData.items);
         findHighestDonationType(responseData.items);
      } catch (err) {}
    };
     fetchNGODetails();


  }, [sendRequest]);

    const findHighestDonationType =  (ngo) => {
        let a = 1;
        let b = 0;
        let item;
        for (var i=0; i<ngo.donationsType.length; i++)
        {
                for (var j=i; j<ngo.donationsType.length; j++)
                {
                        if (ngo.donationsType[i] == ngo.donationsType[j])
                         b++;
                        if (a<b)
                        {
                          a=b;
                          item = ngo.donationsType[i];
                        }
                }
                b=0;
        }
        setItem(item);
        handlePreferred(item);
        console.log(item+" ( " +a +" times ) ") ;
    }

  const handlePreferred =  (item) => {
    console.log("reached");

    try {
      const responseData =  sendRequest(
        `${Path}api/admin/updatePreferredType`,
        "POST",
        JSON.stringify({
          type:item,
          ngo_id:id
        }),
        {
          "Content-Type": "application/json",
        }
      );
      console.log(responseData);
    } catch (err) {}

  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <SimplePaper elevation="24" title="Data Analytics"></SimplePaper>
      {ngo && (
        <Paper style={{backgroundColor: "white", height: "140vh"}}>
          <Box display="flex" flexDirection="column" style={{width: "100%"}}>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              style={{width: "100%"}}
            >
              <h1 style={{margin: '4rem'}}>{ngo.nameNGO}</h1>
            </Box>

            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-around"
              style={{width: "100%"}}
            >
              <Box
                display="flex"
                flexDirection="column"
                className={classes.root}

              >
                <Typography variant="h4" component="div" gutterBottom>
                  NGO Head
                </Typography>
                <Avatar image={`${Path}${ngo.image}`} alt={ngo.name} />
                <Typography variant="h4" component="div" gutterBottom>
                  {ngo.name}
                </Typography>

              </Box>

              <Box>
                <Typography variant="h4" component="div" gutterBottom>
                  Description
                </Typography>
                <Box borderRadius={25} {...defaultProps}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {ngo.descriptionNGO}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              style={{width: "100%", marginTop: "7rem"}}
            >
              <Typography variant="h4" component="div" gutterBottom>
                Donations Types History
              </Typography>
            </Box>

            <Box
            display="flex"
              flexDirection="row"
              justifyContent="center"
              style={{width: "100%", marginBottom:"4rem"}}>
            <List component="nav" className={classes.list}>
              {ngo.donationsType.map((donation,index) => (
                <ListItem button>
                  <ListItemText primary={index+1}/>
                  <ListItemSecondaryAction>
                     {donation}
                   </ListItemSecondaryAction>
                </ListItem>
              ))}


             </List>
             </Box>

             <Box
             display="flex"
               flexDirection="row"
               justifyContent="center"
               style={{width: "100%"}}>
               <Typography variant="h6" component="div" gutterBottom>
                 Most Preferred Donation: {donationItem}
               </Typography>
               </Box>

          </Box>
        </Paper>
      )}
    </>
  );
};

export default NGODetails;
