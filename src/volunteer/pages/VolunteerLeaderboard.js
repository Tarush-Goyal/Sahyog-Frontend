import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import makeStyles from "@material-ui/core/styles";
import SimpleList from "../../shared/components/material-ui/SimpleList";
import SimplePaper from "../../shared/components/material-ui/SimplePaper";
import { useParams, useHistory } from "react-router-dom";
import Path from "../../shared/Path";
import UsersList from "../../user/components/UsersList";

const VolunteerLeaderboard = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const id = useParams().id;
  useEffect(() => {
    console.log(Path);
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${Path}api/users/volunteerLeaderBoard/${id}`
        );
        console.log(responseData);
        // setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <SimplePaper title='Leaderboard'></SimplePaper>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && (
        //
        <UsersList items={loadedUsers}></UsersList>
        // </Box>
      )}
    </React.Fragment>
  );
};

export default VolunteerLeaderboard;
