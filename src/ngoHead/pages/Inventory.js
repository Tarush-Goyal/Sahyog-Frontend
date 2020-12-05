import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import makeStyles from "@material-ui/core/styles";
import SimplePaper from "../../shared/components/material-ui/SimplePaper";
import MediaPaper from "../../shared/components/material-ui/MediaPaper";
import Box from "@material-ui/core/Box";
import { useAuth } from "../../shared/hooks/auth-hook";
import Path from "../../shared/Path";
import { useParams, useHistory } from "react-router-dom";

const Inventory = () => {
  // const { token, login, logout, userId, type } = useAuth();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [inventory, setInventory] = useState();
  const id = useParams().id;

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const responseData = await sendRequest(
          `${Path}api/ngohead/inventory/${id}`
        );
        console.log(responseData.items);
        setInventory(responseData.items);
      } catch (err) {}
    };
    fetchInventory();
  }, [sendRequest]);

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
