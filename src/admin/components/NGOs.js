import React, {useEffect, useState, useRef} from "react";
import {makeStyles} from "@material-ui/core/styles";
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
import {useHttpClient} from "../../shared/hooks/http-hook";

import Button from "@material-ui/core/Button";

import {useAuth} from "../../shared/hooks/auth-hook";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {useHistory} from "react-router-dom";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";
import Path from "../../shared/Path";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

const NGOs = () => {
  let gg;
  const {token, login, logout, userId, type} = useAuth();
  const [ngos, setNgos] = useState();
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const classes = useStyles();
  let history = useHistory();

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const responseData = await sendRequest(`${Path}api/admin/getNGOs`);
        console.log(responseData);
        setNgos(responseData.items);
      } catch (err) {}
    };
    fetchNGOs();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <SimplePaper elevation="24" title="Current NGOs"></SimplePaper>
      <Box display="flex" flexDirection="row" justifyContent="center">
        <Box>
          <Card style={{backgroundColor: "#f5f5f5", width: "74rem"}}>
            <CardContent>
              <TableContainer
                component={Paper}
                style={{width: "68rem", margin: "2rem"}}
              >
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>NGO Name</TableCell>
                      <TableCell align="center">Donations Accepted</TableCell>
                      <TableCell align="center">Donations Completed</TableCell>
                      <TableCell align="center">Members Count</TableCell>
                    </TableRow>
                  </TableHead>
                  {isLoading && (
                    <div className="center">
                      <LoadingSpinner />
                    </div>
                  )}
                  {!isLoading && ngos && (
                    <TableBody>
                      {ngos.map((ngo, index) => (
                        <>
                          <TableRow key={index} hover style={{cursor:"pointer"}} onClick={()=>{
                            history.push(`/ngodetails/${ngo._id}`)
                          }
                        }
                            >
                              <TableCell component="th" scope="row">
                                {ngo.nameNGO}
                              </TableCell>
                            <TableCell align="center">
                              {ngo.donationsAccepted}
                            </TableCell>
                            <TableCell align="center">
                              {ngo.donationsCompleted}
                            </TableCell>
                            <TableCell align="center">
                              {ngo.volunteers.length}
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

export default NGOs;
