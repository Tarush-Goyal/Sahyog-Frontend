import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import makeStyles from "@material-ui/core/styles";
import SimpleList from "../../shared/components/material-ui/SimpleList";
import SimplePaper from "../../shared/components/material-ui/SimplePaper";

import Path from "../../shared/Path";
import UsersList from "../components/UsersList";

const Leaderboard = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    console.log(Path);
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(`${Path}api/homeowner`);

        sortUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  const sortUsers = (data) => {
    console.log(data);
    data.sort(
      (a, b) => parseFloat(b.items.length) - parseFloat(a.items.length)
    );
    setLoadedUsers(data);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <SimplePaper title='Leaderboard'></SimplePaper>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers}></UsersList>}
    </React.Fragment>
  );
};

export default Leaderboard;
