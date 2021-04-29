import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import SimplePaper from "../../shared/components/material-ui/SimplePaper";
import Path from "../../shared/Path";
import UsersList from "../components/UsersList";

const Leaderboard = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(`${Path}api/homeowner`);

        sortUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  const sortUsers = (data) => {
    data.sort(
      (a, b) => parseFloat(b.items.length) - parseFloat(a.items.length)
    );
    setLoadedUsers(data);
  };
  let someImage = <p>hello</p>;

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <SimplePaper title='Top Contributers'></SimplePaper>
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
