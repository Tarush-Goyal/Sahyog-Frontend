import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import makeStyles from "@material-ui/core/styles";
import SimplePaper from "../../shared/components/material-ui/SimplePaper";
import MediaPaper from "../../shared/components/material-ui/MediaPaper";
import Box from "@material-ui/core/Box";

const Inventory = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [inventory, setInventory] = useState("s");

  // useEffect(() => {
  //   const fetchInventory = async () => {
  //     try {
  //       const responseData = await sendRequest(
  //         "http://localhost:5000/api/users/inventory"
  //       );

  //       setInventory(responseData);
  //     } catch (err) {}
  //   };
  //   fetchInventory();
  // }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <SimplePaper title='Inventory'></SimplePaper>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && inventory && <MediaPaper items={inventory}></MediaPaper>}
    </React.Fragment>
  );
};

export default Inventory;
