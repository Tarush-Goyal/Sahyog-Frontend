import React, { useEffect, useState, useRef, useContext } from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Path from "../../shared/Path";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import { green } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Box from "@material-ui/core/Box";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { AuthContext } from "../../shared/context/auth-context";
//import { useAuth } from "../../shared/hooks/auth-hook";


export default function VolunteerRequests(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [volunteers, setVolunteers] = React.useState();
    const [open2, setOpen2] = React.useState();
    const auth = useContext(AuthContext);
    // const { token, login, logout, userId, type } = useAuth();

  useEffect(() => {
     const fetchVolunteers = async () => {

    await axios.get(`${Path}api/ngohead/volunteersNotApproved/${auth.userId}`)
          .then((response) => {
            console.log(response.data.items);
            setVolunteers(response.data.items);
          }
        );
      }
   fetchVolunteers();
  }, []);

  const handleClickOpen2 = () => {
    setOpen2(true);

  };

  const handleClose2 = (status) => {
    setOpen2(false);
  };

  const handleClick = (event) => {
    console.log("clicked");
    setAnchorEl(event.currentTarget);
  };

  const handleVolunteerRequest = async (index, status) => {
    console.log("entered");
    let volunteerRequests = volunteers.filter((volunteer, volunteerIndex) => {
      return volunteerIndex != index;
    });
    setVolunteers(volunteerRequests);
    console.log(volunteerRequests);

    try {
      const responseData = await sendRequest(
        `${Path}api/ngohead/approveOrDeclineVolunteer`,
        "POST",
        JSON.stringify({
          _id: volunteers[index]._id,
          approve: status,
        }),
        {
          "Content-Type": "application/json",
        }
      );
    } catch (err) {}
  };

  const handleClose = () => {
    setAnchorEl(false);
  };

  return (
    <div>
    <Dialog
      open={open2}
      onClose={handleClose2}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'>
      <DialogTitle id='alert-dialog-title2'>Volunteer Requests</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {volunteers && (
            <Box
              display='flex'
              flexDirection='column'
              justifyContent='space-around'>
              <Typography variant='subtitle2' gutterBottom>

              </Typography>
              <Typography variant='subtitle2' gutterBottom>
              <List component="nav" aria-label="secondary mailbox folders">



              {volunteers.map((volunteer, index) => (
                <ListItem button onClick={()=>{console.log("clicked")}}>
                  <ListItemText primary={volunteer.name} />
                  <IconButton
                    color='secondary'
                    aria-label='cross'
                    onClick={() => {
                      handleVolunteerRequest(index, false);
                    }}>
                    <ClearIcon />
                  </IconButton>
                  <IconButton
                    aria-label='tick'
                    onClick={() => {
                      handleVolunteerRequest(index, true);
                    }}>
                    <CheckIcon style={{ color: green[500] }} />
                  </IconButton>
                </ListItem>

              ))}



    </List>
              </Typography>
            </Box>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose2(true);
          }}
          color='primary'>
          OK
        </Button>
      </DialogActions>
    </Dialog>
        <div>
      <Button
        color='inherit'
        aria-controls='simple-menu'
        aria-haspopup='true'
        onClick={(e)=>{
          handleClickOpen2();
        }}>
        See Volunteer Requests
      </Button>
      {volunteers && (
        <Menu
          id='simple-menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}>
          <MenuItem style={{ backgroundColor: "black" }}>
            <Typography
              variant='subtitle1'
              gutterBottom
              style={{ color: "white" }}>
              Pending Requests
            </Typography>
          </MenuItem>
          {volunteers.map((volunteer, index) => (
            <MenuItem>
              {volunteer.name}{" "}
              <IconButton
                color='secondary'
                aria-label='cross'
                onClick={() => {
                  handleVolunteerRequest(index, false);
                }}>
                <ClearIcon />
              </IconButton>
              <IconButton
                aria-label='tick'
                onClick={() => {
                  handleVolunteerRequest(index, true);
                }}>
                <CheckIcon style={{ color: green[500] }} />
              </IconButton>
            </MenuItem>
          ))}
        </Menu>
          )}
        </div>

    </div>
  );
}
