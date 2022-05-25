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
          // mergeSort(responseData.items)
        sortUsers(responseData.items);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  const merge = (left, right) => {
    console.log("in merge");
    let sortedArr = [];
  
    while (left.length && right.length) {
      if (parseFloat(left.donationsAccepted.length) < parseFloat(right.donationsAccepted.length)) {
        sortedArr.push(left.shift());
      } else {
        sortedArr.push(right.shift());
      }
    }
  
    return [...sortedArr, ...left, ...right];
  }

 const mergeSort = (arr) => {
   console.log("in merge sort");
  const half = arr.length / 2;

  if (arr.length <= 1) {
    return arr;
  }

  const left = arr.splice(0, half);
  const right = arr.splice(half+1,arr.length-1);
  return merge(mergeSort(left), mergeSort(right));
}

  const sortUsers = (data) => {
    console.log(data);
    // data = mergeSort(data);
    console.log("data:");
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
