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
import { useAuth } from "../../shared/hooks/auth-hook";
import Path from "../../shared/Path";
import { useParams, useHistory } from "react-router-dom";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const NGOVolunteerDetails = () => {
  const classes = useStyles();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [volunteers, setVolunteers] = useState();
  const id = useParams().id;

  useEffect(() => {
    const getVolunteers = async () => {
      try {
        const responseData = await sendRequest(
          `${Path}api/ngohead/getVolunteers/${id}`
        );

        console.log(responseData.items);
        setVolunteers(responseData.items);
      } catch (err) {}
    };
    getVolunteers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />

      <SimplePaper title='Volunteer Details'></SimplePaper>
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
                      <TableCell align='center'>Volunteer Image</TableCell>
                      <TableCell align='center'>Volunteer Name</TableCell>
                      <TableCell align='center'>Email</TableCell>
                      <TableCell align='center'>Donations Picked Up</TableCell>
                    </TableRow>
                  </TableHead>
                  {isLoading && (
                    <div className='center'>
                      <LoadingSpinner />
                    </div>
                  )}
                  {!isLoading && volunteers && (
                    <TableBody>
                      {volunteers.map((volunteer, index) => (
                        <>
                          <TableRow key={index}>
                            <TableCell
                              component='th'
                              scope='row'
                              align='center'>
                              <Box
                                display='flex'
                                flexDirection='row'
                                justifyContent='center'>
                                <Avatar
                                  alt={volunteer.name}
                                  src={`${Path}api/uploads/singleimage/${volunteer.imageGrid}`}
                                />
                              </Box>
                            </TableCell>
                            <TableCell
                              component='th'
                              scope='row'
                              align='center'>
                              {volunteer.name}
                            </TableCell>
                            <TableCell align='center'>
                              {volunteer.email}
                            </TableCell>
                            <TableCell align='center'>
                              {volunteer.donationAccepted.length}
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

export default NGOVolunteerDetails;
