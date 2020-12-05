import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import SimplePaper from "../../shared/components/material-ui/SimplePaper";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
// import { useAuth } from "../../shared/hooks/auth-hook";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useParams, useHistory } from "react-router-dom";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";
import { useReactToPrint } from "react-to-print";
import Path from "../../shared/Path";
import { useAuth } from "../../shared/hooks/auth-hook";
// import VolunteerID from "../components/VolunteerID";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const DonationsStatus = () => {
  const history = useHistory();
  const { token, login, logout, userId, type } = useAuth();
  const [open2, setOpen2] = React.useState();
  const [volunteerInfo, setVolunteerInfo] = React.useState();
  const [open, setOpen] = React.useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [value, setValue] = useState(false);
  const id = useParams().id;
  const [donations, setDonations] = useState();
  const classes = useStyles();
  const [activeIndex, setIndex] = useState(0);
  const [OTP, setOTP] = useState(0);
  const [OTPStatus, setOTPStatus] = useState();

  const handleOpening = (index) => {
    // 1. Make a shallow copy of the items
    let items = [...donations];
    // 2. Make a shallow copy of the item you want to mutate
    let item = { ...items[index] };
    // 3. Replace the property you're intested in
    item.open = !item.open;
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items[index] = item;
    // 5. Set the state to our new copy
    setDonations(items);
    setValue(false);
  };

  const handleFormChange = (event) => {
    event.preventDefault();
    const { value } = event.target;
    setOTP(value);
  };

  const handleClickOpen2 = (index) => {
    setOpen2(true);
    setIndex(index);
    console.log(donations[activeIndex].userId.name);
    // setDialogName(requests[index].itemName);
  };

  const handleClickOpen = (index) => {
    setOTPStatus(true);
    setOpen(true);
    setIndex(index);
    // setDialogName(requests[index].itemName);
  };

  const confirmPickup = async () => {
    try {
      const responseData = await sendRequest(
        `${Path}api/users/pickRequest/${donations[activeIndex].id}`,
        "POST"
      );
    } catch (err) {}
    history.push(`/requests`);
  };

  const checkOTP = () => {
    console.log(donations[activeIndex].otp);
    if (OTP == donations[activeIndex].otp) {
      // console.log("accepted");
      setOTPStatus(true);
      setOpen(false);
      confirmPickup();
    } else {
      setOTPStatus(false);
    }
  };

  const handleClose2 = (status) => {
    setOpen2(false);
  };

  const handleClose = (status) => {
    if (status == true) {
      checkOTP();
      // console.log(requests[currentIndex]);
      // authSubmitHandler();
      // history.push("/leaderboard");
    } else {
      setOpen(false);
    }
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const generateID = (index) => {
    const fetchVolunteer = async () => {
      try {
        const responseData = await sendRequest(
          `${Path}api/users/volunteerId/${donations[index].assignedVolunteer}`
        );
        console.log(responseData);
        setVolunteerInfo(responseData);
        setValue(true);
        handlePrint();
        // setValue(return(<h1>grgr</h1>));
      } catch (err) {}
    };
    fetchVolunteer();

    // if (volunteerInfo) {

    // }
    console.log(value);
  };

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const responseData = await sendRequest(
          `${Path}api/users/itemsAcceptedByVolunteerId/${id}`
        );
        console.log(responseData.items);
        let results = responseData.items;
        results.map((result) => {
          result.open = false;
        });
        console.log(results);
        setDonations(results);
      } catch (err) {}
    };
    fetchDonations();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>Confirm Pickup?</DialogTitle>
        <DialogContent>
          {OTPStatus == false && (
            <Alert severity='error' style={{ marginBottom: "1rem" }}>
              Incorrect OTP
            </Alert>
          )}
          <DialogContentText id='alert-dialog-description'>
            Enter the OTP provided by Donator:
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='otp'
            label='OTP'
            type='text'
            onBlur={handleFormChange}
            onChange={handleFormChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose(false);
            }}
            color='primary'>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose(true);
            }}
            color='primary'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open2}
        onClose={handleClose2}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title2'>User Details</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {donations && (
              <Box
                display='flex'
                flexDirection='column'
                justifyContent='space-around'>
                <Typography variant='subtitle2' gutterBottom>
                  Donator Name: {donations[activeIndex].userId.name}
                </Typography>
                <Typography variant='subtitle2' gutterBottom>
                  Donator Address:
                  {donations[activeIndex].address.house +
                    " " +
                    donations[activeIndex].address.street +
                    " " +
                    donations[activeIndex].address.landmark +
                    " " +
                    donations[activeIndex].address.pincode +
                    " " +
                    donations[activeIndex].address.city +
                    " " +
                    donations[activeIndex].address.state}
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
      <SimplePaper elevation='24' title='Status of Donations'></SimplePaper>
      <Box display='flex' flexDirection='row' justifyContent='center'>
        <Box>
          <Card style={{ backgroundColor: "#f5f5f5", width: "74rem" }}>
            <CardContent>
              <TableContainer
                component={Paper}
                style={{ width: "68rem", margin: "2rem" }}>
                <Table className={classes.table} aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ visibility: "hidden" }}>
                        <IconButton aria-label='expand row' size='small' />
                      </TableCell>
                      <TableCell>Item Name</TableCell>
                      <TableCell align='center'>Category</TableCell>
                      <TableCell align='center'>Quantity</TableCell>
                      <TableCell align='center'>Pickup Date</TableCell>
                      <TableCell align='center'>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  {isLoading && (
                    <div className='center'>
                      <LoadingSpinner />
                    </div>
                  )}
                  {!isLoading && donations && (
                    <TableBody>
                      {donations.map((request, index) => (
                        <>
                          <TableRow key={index}>
                            <TableCell>
                              <IconButton
                                aria-label='expand row'
                                size='small'
                                onClick={() => {
                                  handleOpening(index);
                                }}>
                                {request.open ? (
                                  <KeyboardArrowUpIcon />
                                ) : (
                                  <KeyboardArrowDownIcon />
                                )}
                              </IconButton>
                            </TableCell>
                            <TableCell component='th' scope='row'>
                              {request.itemName}
                            </TableCell>
                            <TableCell align='center'>
                              {request.category}
                            </TableCell>
                            <TableCell align='center'>
                              {request.quantity}
                            </TableCell>
                            <TableCell align='center'>
                              {request.date.slice(0, 16)}
                            </TableCell>
                            <TableCell
                              align='center'
                              style={{
                                color:
                                  request.status == "active"
                                    ? "red"
                                    : request.status == "pending"
                                    ? "blue"
                                    : "green",
                              }}>
                              {request.status}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              style={{ paddingBottom: 0, paddingTop: 0 }}
                              colSpan={7}>
                              <Collapse
                                in={request.open}
                                timeout='auto'
                                unmountOnExit>
                                <Box
                                  display='flex'
                                  flexDirection='row'
                                  justifyContent='space-around'>
                                  <Button
                                    onClick={() => {
                                      handleClickOpen2(index);
                                    }}
                                    variant='outlined'
                                    color='primary'
                                    style={{ width: "20rem" }}>
                                    See Donator Details
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      handleClickOpen(index);
                                    }}
                                    variant='outlined'
                                    color='primary'
                                    style={{
                                      width: "20rem",
                                      display:
                                        request.status == "pending"
                                          ? "initial"
                                          : "none",
                                    }}>
                                    Confirm Pickup
                                  </Button>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </>
                      ))}
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default DonationsStatus;
