import React, { useEffect, useState, useRef } from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Path from "../../Path";
import { useHttpClient } from "../../hooks/http-hook";
import ClearIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import { green } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
export default function SimpleMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [volunteers, setVolunteers] = React.useState();

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const responseData = await sendRequest(
          `${Path}api/ngohead/volunteersNotApproved/${props.id}`
        );

        console.log(responseData.items);
        setVolunteers(responseData.items);

        // setDonations(results);
      } catch (err) {}
    };
    fetchVolunteers();
  }, [sendRequest]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleVolunteerRequest = async (index, status) => {
    console.log("entered");
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
      // history.push(`/volunteers/${props.route}`);
      // console.log(userId);
    } catch (err) {}
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        color='inherit'
        aria-controls='simple-menu'
        aria-haspopup='true'
        onClick={handleClick}>
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
                  // handleQuantityPlus(index);
                }}>
                <ClearIcon />
              </IconButton>
              <IconButton
                aria-label='tick'
                onClick={() => {
                  handleVolunteerRequest(index, true);
                  // handleQuantityPlus(index);
                }}>
                <CheckIcon style={{ color: green[500] }} />
              </IconButton>
            </MenuItem>
          ))}

          {/* <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem> */}
        </Menu>
      )}
    </div>
  );
}
