import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Button from "@material-ui/core/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import makeStyles from "@material-ui/core/styles";
import SimplePaper from "../../shared/components/material-ui/SimplePaper";
import MediaPaper from "../../shared/components/material-ui/MediaPaper";
import Box from "@material-ui/core/Box";
import { useAuth } from "../../shared/hooks/auth-hook";
import Path from "../../shared/Path";
import { useParams, useHistory } from "react-router-dom";
import TrieSearch from "trie-search";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
// import Box from "@material-ui/core/Box";
// var TrieSearch = require("trie-search");

var arr = [
  { name: "andrew", age: 21 },
  { name: "andy", age: 37 },
  { name: "andrea", age: 25 },
  { name: "annette", age: 67 },
];

const Inventory = () => {
  // const { token, login, logout, userId, type } = useAuth();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [inventory, setInventory] = useState();
  const [inventory2, setInventory2] = useState();
  const id = useParams().id;
  const ts = new TrieSearch("category");

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      ts.addAll(inventory);
      setInventory(inventory2);
      // console.log(ts.get("c"));
      setInventory(ts.get(event.target.value));
    }
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const responseData = await sendRequest(
          `${Path}api/ngohead/inventory/${id}`
        );
        console.log(responseData.items);
        setInventory(responseData.items);
        setInventory2(responseData.items);

        console.log(ts.get("c"));
      } catch (err) {}
    };
    fetchInventory();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <SimplePaper title='Inventory'></SimplePaper>
      <Box display='flex' flexDirection='row' justifyContent='flex-end'>
        <TextField
          onKeyUp={handleSearch}
          style={{ backgroundColor: "white" }}
          variant='filled'
          id='search'
          label='Search...'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon></SearchIcon>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && inventory && (
        <MediaPaper route={id} items={inventory}></MediaPaper>
      )}
    </React.Fragment>
  );
};

export default Inventory;
