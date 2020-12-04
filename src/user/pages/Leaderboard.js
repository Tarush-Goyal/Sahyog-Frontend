import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import makeStyles from "@material-ui/core/styles";
import SimpleList from "../../shared/components/material-ui/SimpleList";
import SimplePaper from "../../shared/components/material-ui/SimplePaper";
import Box from "@material-ui/core/Box";
import Path from "../../shared/Path";

const Leaderboard = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    console.log(Path);
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(`${Path}api/users`);

        setLoadedUsers(responseData.users);
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
        <Box display='flex' flexDirection='row' justifyContent='center'>
          <SimpleList items={loadedUsers}></SimpleList>
        </Box>
      )}
    </React.Fragment>
  );
};

export default Leaderboard;
