import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useParams, useHistory } from "react-router-dom";
import Path from "../../shared/Path";
import VolunteerList from "../components/VolunteerList";
import SimplePaper from "../../shared/components/material-ui/SimplePaper";

const Leaderboard = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const id = useParams().id;
  useEffect(() => {
    console.log(Path);
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${Path}api/volunteer/volunteerLeaderBoard/${id}`
        );
        sortUsers(responseData.items);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  const sortUsers = (data) => {
    console.log(data);
    data.sort(
      (a, b) =>
        parseFloat(b.donationAccepted.length) -
        parseFloat(a.donationAccepted.length)
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
      {!isLoading && loadedUsers && (
        <VolunteerList items={loadedUsers}></VolunteerList>
      )}
    </React.Fragment>
  );
};

export default Leaderboard;
