// import React, { useEffect, useState, useRef } from "react";
// import { makeStyles } from "@material-ui/core/styles";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
// import Paper from "@material-ui/core/Paper";
// import SimplePaper from "../../shared/components/material-ui/SimplePaper";
// import ErrorModal from "../../shared/components/UIElements/ErrorModal";
// import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
// import { useHttpClient } from "../../shared/hooks/http-hook";
// import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import Button from "@material-ui/core/Button";

// import { useAuth } from "../../shared/hooks/auth-hook";
// import Card from "@material-ui/core/Card";
// import CardActions from "@material-ui/core/CardActions";
// import CardContent from "@material-ui/core/CardContent";
// import IconButton from "@material-ui/core/IconButton";
// import Typography from "@material-ui/core/Typography";
// import Box from "@material-ui/core/Box";
// import { useParams, useHistory } from "react-router-dom";
// import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
// import Collapse from "@material-ui/core/Collapse";
// import { useReactToPrint } from "react-to-print";
// import Path from "../../shared/Path";
// // import VolunteerID from "../components/VolunteerID";

// const useStyles = makeStyles({
//   table: {
//     minWidth: 650,
//   },
// });

// const Status = () => {
//   const { token, login, logout, userId, type } = useAuth();
//   // const [open, setOpen] = React.useState();
//   const [volunteerInfo, setVolunteerInfo] = React.useState();
// const [open, setOpen] = React.useState(false);
//   const { isLoading, error, sendRequest, clearError } = useHttpClient();
//   const [value, setValue] = useState(false);
//   const id = useParams().id;
//   const [donations, setDonations] = useState([]);
//   const classes = useStyles();

//   const handleOpening = (index) => {
//     // 1. Make a shallow copy of the items
//     let items = [...donations];
//     // 2. Make a shallow copy of the item you want to mutate
//     let item = { ...items[index] };
//     // 3. Replace the property you're intested in
//     item.open = !item.open;
//     // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
//     items[index] = item;
//     // 5. Set the state to our new copy
//     setDonations(items);
//     setValue(false);
//   };

//   const componentRef = useRef();
//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   const generateID = (index) => {
//     const fetchVolunteer = async () => {
//       try {
//         const responseData = await sendRequest(
//           `${Path}api/users/volunteerId/${donations[index].assignedVolunteer}`
//         );
//         console.log(responseData);
//         setVolunteerInfo(responseData);
//         setValue(true);
//         handlePrint();
//         // setValue(return(<h1>grgr</h1>));
//       } catch (err) {}
//     };
//     fetchVolunteer();

//     // if (volunteerInfo) {

//     // }
//     console.log(value);
//   };

//   useEffect(() => {
//     const fetchDonations = async () => {
//       try {
//         const responseData = await sendRequest(
//           `${Path}api/users/itemsAcceptedByVolunteerId/${id}`
//         );
//         console.log(responseData.items);
//         let results = responseData.items;
//         results.map((result) => {
//           result.open = false;
//         });
//         console.log(results);
//         setDonations(results);
//       } catch (err) {}
//     };
//     fetchDonations();
//   }, [sendRequest]);

//   return (
//     <>
//       <ErrorModal error={error} onClear={clearError} />
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         aria-labelledby='alert-dialog-title'
//         aria-describedby='alert-dialog-description'>
//         <DialogTitle id='alert-dialog-title'>
//           {"Accept this Donation Request?"}
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id='alert-dialog-description'>
//             You agree that you will pick up <u>{dialogName}</u> on the scheduled
//             pickup date
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => {
//               handleClose(false);
//             }}
//             color='primary'>
//             No
//           </Button>
//           <Button
//             onClick={() => {
//               handleClose(true);
//             }}
//             color='primary'>
//             Yes
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <SimplePaper elevation='24' title='Status of Donations'></SimplePaper>
//       <Box display='flex' flexDirection='row' justifyContent='center'>
//         <Box>
//           <Card style={{ backgroundColor: "#f5f5f5", width: "74rem" }}>
//             <CardContent>
//               <TableContainer
//                 component={Paper}
//                 style={{ width: "68rem", margin: "2rem" }}>
//                 <Table className={classes.table} aria-label='simple table'>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell style={{ visibility: "hidden" }}>
//                         <IconButton aria-label='expand row' size='small' />
//                       </TableCell>
//                       <TableCell>Item Name</TableCell>
//                       <TableCell align='center'>Category</TableCell>
//                       <TableCell align='center'>Quantity</TableCell>
//                       <TableCell align='center'>Pickup Date</TableCell>
//                       <TableCell align='center'>Status</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   {isLoading && (
//                     <div className='center'>
//                       <LoadingSpinner />
//                     </div>
//                   )}
//                   {!isLoading && donations && (
//                     <TableBody>
//                       {donations.map((request, index) => (
//                         <>
//                           <TableRow key={index}>
//                             <TableCell>
//                               <IconButton
//                                 aria-label='expand row'
//                                 size='small'
//                                 onClick={() => {
//                                   handleOpening(index);
//                                 }}>
//                                 {request.open ? (
//                                   <KeyboardArrowUpIcon />
//                                 ) : (
//                                   <KeyboardArrowDownIcon />
//                                 )}
//                               </IconButton>
//                             </TableCell>
//                             <TableCell component='th' scope='row'>
//                               {request.itemName}
//                             </TableCell>
//                             <TableCell align='center'>
//                               {request.category}
//                             </TableCell>
//                             <TableCell align='center'>
//                               {request.quantity}
//                             </TableCell>
//                             <TableCell align='center'>
//                               {request.date.slice(0, 16)}
//                             </TableCell>
//                             <TableCell
//                               align='center'
//                               style={{
//                                 color:
//                                   request.status == "active"
//                                     ? "red"
//                                     : request.status == "pending"
//                                     ? "blue"
//                                     : "green",
//                               }}>
//                               {request.status}
//                             </TableCell>
//                           </TableRow>
//                           <TableRow>
//                             <TableCell
//                               style={{ paddingBottom: 0, paddingTop: 0 }}
//                               colSpan={7}>
//                               <Collapse
//                                 in={request.open}
//                                 timeout='auto'
//                                 unmountOnExit>
//                                 <Box
//                                   display='flex'
//                                   flexDirection='row'
//                                   justifyContent='space-around'>
//                                   <Button
//                                     onClick={() => {
//                                       generateID(index);
//                                     }}
//                                     variant='outlined'
//                                     color='primary'
//                                     style={{ width: "20rem" }}>
//                                     See Donater Details
//                                   </Button>
//                                   <Button
//                                     onClick={() => {
//                                       handleClickOpen(index);
//                                     }}
//                                     variant='outlined' color='primary' style=
//                                     {{
//                                       width: "20rem",
//                                       visibility:
//                                         request.status == "pending"
//                                           ? "visible"
//                                           : "hidden",
//                                     }}
//                                     > Confirm Pickup
//                                   </Button>
//                                 </Box>
//                               </Collapse>
//                             </TableCell>
//                           </TableRow>
//                         </>
//                       ))}
//                     </TableBody>
//                   )}
//                 </Table>
//               </TableContainer>
//             </CardContent>
//           </Card>
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default Status;