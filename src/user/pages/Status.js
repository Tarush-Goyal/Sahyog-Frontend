import React, { useEffect, useState } from "react";
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
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
// import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

// let donation = [
//   {
//     itemName: "dewfrt",
//     category: "efwrgt",
//     quantity: 5,
//     date: "dwefrdf",
//     status: "active",
//     assignedVolunteer: "Ramesh",
//   },
//   {
//     itemName: "dewfrt",
//     category: "efwrgt",
//     quantity: 5,
//     date: "dwefrdf",
//     status: "pending",
//     assignedVolunteer: "Ramesh",
//   },
//   {
//     itemName: "dewfrt",
//     category: "efwrgt",
//     quantity: 5,
//     date: "dwefrdf",
//     status: "completed",
//     assignedVolunteer: "Ramesh",
//   },
// ];

const Status = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [donations, setDonations] = useState([]);
  const classes = useStyles();
  const { token, login, logout, userId, type } = useAuth();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/donate/itemsDonatedByUserId/${userId}`
        );

        setDonations(responseData);
      } catch (err) {}
    };
    fetchDonations();
  }, [sendRequest]);

  useEffect(() => {
    setDonations(donation);
  });

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <SimplePaper elevation='24' title='Status of Donations'></SimplePaper>
      <Box display='flex' flexDirection='row' justifyContent='center'>
        <Box>
          <Card style={{ backgroundColor: "#f5f5f5", width: "74rem" }}>
            <CardContent>
              <TableContainer
                component={Paper}
                style={{ width: "68rem", margin: "2rem" }}>
                {isLoading && (
                  <div className='center'>
                    <LoadingSpinner />
                  </div>
                )}
                {!isLoading && donations && (
                  <Table className={classes.table} aria-label='simple table'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Item Name</TableCell>
                        <TableCell align='center'>Category</TableCell>
                        <TableCell align='center'>Quantity</TableCell>
                        <TableCell align='center'>Pickup Date</TableCell>
                        <TableCell align='center'>Status</TableCell>
                        <TableCell align='center'>Assigned Volunteer</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {donations.map((request, index) => (
                        <TableRow key={index}>
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
                          <TableCell align='center'>
                            {request.volunteer}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default Status;
