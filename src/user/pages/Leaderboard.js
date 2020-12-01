import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import makeStyles from "@material-ui/core/styles";
import SimpleList from "../../shared/components/material-ui/SimpleList";
import SimplePaper from "../../shared/components/material-ui/SimplePaper";

const Leaderboard = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <SimplePaper title='Leaderboard'></SimplePaper>
      <SimpleList></SimpleList>
    </React.Fragment>
  );
};

export default Leaderboard;
