import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
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
import { useHistory } from "react-router-dom";
import { useAuth } from "../../shared/hooks/auth-hook";
import Path from "../../shared/Path";
import axios from "axios";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { useParams } from "react-router-dom";
import Select from "@material-ui/core/Select";


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  formControl: {
    minWidth: 120,
  },
});

const ActiveDonations = () => {
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const classes = useStyles();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [approvalStatus, setApprovalStatus] = useState("");
  const [requests, setActiveRequests] = useState([]);
  const [originalRequests, setoriginalRequests] = useState([]);
  const [filter, setFilter] = useState("default");
  const [currentIndex, setIndex] = useState(0);
  const [dialogName, setDialogName] = useState("");
  const [prefer,setPreferred] = useState();
  const id = useParams().id;
  //const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm');
  const { token, login, logout, userId, type } = useAuth();
  const auth = useContext(AuthContext);


  const handleClickOpen = (index) => {
    setOpen(true);
    setIndex(index);
    setDialogName(requests[index].itemName);
  };

  const handleClickOpen2 = (index) => {
    setOpen2(true);
    // setIndex(index);
    // setDialogName(requests[index].itemName)
  };

  const authSubmitHandler = async (event) => {
    let data = {
      ...requests[currentIndex],
    };
    data.volunteerId = id;
    // console.log(data);
    try {
      axios
        .post(`${Path}api/volunteer/acceptRequest`, JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.statusText);
        });
    } catch (err) {}
  };

  const handleClose = (status) => {
    setOpen(false);
    if (status == true) {
      authSubmitHandler();
      history.push(`/leaderboard/${userId}`);
      console.log(userId);
    }
  };

  const handleSelectChange = (event) => {
    let value = event.target.value;
    setFilter(value);
  };

  useEffect(() => {
    const filterRequests = () => {
      if (filter == "recommended") {
        let request = originalRequests.filter((request) => {
          return request.category == prefer;
        });
        setActiveRequests(request);
      } else if (filter == "default"){
        setActiveRequests(originalRequests);
      } else{
        let request = originalRequests.filter((request) => {
          return request.category == filter;
        });
        setActiveRequests(request);
      }
    };
    filterRequests();
  }, [filter]);

  useEffect(() => {
    console.log("entered use effect");
    const activeDonations = async () => {
      try {
        const responseData = await sendRequest(
          `${Path}api/volunteer/activeDonationRequest`
        );

          //here id is volunteer id
          console.log(responseData);

        const volunteerDetails = await sendRequest(
          `${Path}api/volunteer/singlevolunteerdetails/${id}`
        );

        console.log("volunteer details:"+volunteerDetails);

        if(volunteerDetails.approval!='approved'){
          if(volunteerDetails.approval=='pending'){
            setApprovalStatus("You are not yet approved by the NGO Head");
          }else{
            setApprovalStatus("You have been rejected by the NGO Head");
          }
          handleClickOpen2();
        }

        const preferred = await sendRequest(
          `${Path}api/admin/sendPreferred/${volunteerDetails.nameNGO}`
        );
          console.log("preferred:")
        console.log(preferred.items);
        setPreferred(preferred.items.preferred);


        let result = responseData.items.map((data) => ({
          _id: data._id,
          userId: data.userId,
          itemName: data.itemName,
          category: data.category,
          quantity: data.quantity,
          date: data.date,
          address:
            data.address.house +
            " " +
            data.address.street +
            " " +
            data.address.landmark +
            " " +
            data.address.pincode +
            " " +
            data.address.city +
            " " +
            data.address.state,
        }));

        setActiveRequests(result);
        setoriginalRequests(result);
      } catch (err) {}
    };
    activeDonations();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Dialog BackdropProps={{style: {backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(3px)"}} }
        open={open2}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>
          Approval Status
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
           {approvalStatus}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button color='inherit' onClick={auth.logout}>
              LOGOUT
            </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>
          {"Accept this Donation Request?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            You agree that you will pick up <u>{dialogName}</u> on the scheduled
            pickup date
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose(false);
            }}
            color='primary'>
            No
          </Button>
          <Button
            onClick={() => {
              handleClose(true);
            }}
            color='primary'>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <SimplePaper title='Active Donation Requests'></SimplePaper>
      <TableContainer component={Paper}>
        {isLoading && (
          <div className='center'>
            <LoadingSpinner />
          </div>
        )}

        <FormControl className={classes.formControl} style={{ margin: "1rem" }}>
          <InputLabel>Sort By</InputLabel>
          <Select id='filter' value={filter} onChange={handleSelectChange}>
            <MenuItem value={"default"}>Default</MenuItem>
            <MenuItem value={"recommended"}>Recommended</MenuItem>
            <MenuItem value={"clothes"}>Clothes</MenuItem>
            <MenuItem value={""}>Shoes</MenuItem>
            <MenuItem value={"books"}>Books</MenuItem>
            <MenuItem value={"food"}>Food</MenuItem>
            <MenuItem value={"stationary"}>Stationary</MenuItem>
            <MenuItem value={"covid"}>Covid</MenuItem>
          </Select>
        </FormControl>

        {!isLoading && requests && (
          <Table className={classes.table} aria-label='simple table'>
            <TableHead>
              <TableRow hover>
                <TableCell>Item Name</TableCell>
                <TableCell align='right'>Category</TableCell>
                <TableCell align='right'>Quantity</TableCell>
                <TableCell align='right'>Pickup Date</TableCell>
                <TableCell style={{ width: "30%" }} align='right'>
                  Address
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request, index) => (
                <TableRow
                  style={{ cursor: "pointer" }}
                  key={index}
                  onClick={() => {
                    handleClickOpen(index);
                  }}>
                  <TableCell component='th' scope='row'>
                    {request.itemName}
                  </TableCell>
                  <TableCell align='right'>{request.category}</TableCell>
                  <TableCell align='right'>{request.quantity}</TableCell>
                  <TableCell align='right'>
                    {request.date.slice(0, 16)}
                  </TableCell>
                  <TableCell align='right'>{request.address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </>
  );
};

export default ActiveDonations;
