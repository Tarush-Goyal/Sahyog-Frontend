import React from "react";

import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";
import "./UsersList.css";
import Box from "@material-ui/core/Box";
import Path from "../../shared/Path";
const UsersList = (props) => {
  console.log(props);
  if (props.items.length === 0) {
    return (
      <div className='center'>
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ul className='users-list'>
        <Box display='flex' flexDirection='column' style={{ width: "100%" }}>
          {props.items.map((user) => (
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='center'
              style={{ width: "100%" }}>
              {user.items && (
                <UserItem
                  key={user.id}
                  id={user.id}
                  image={`api/uploads/singleimage/${user.imageGrid}`}
                  name={user.name}
                  itemCount={user.items.length}
                  text='Donation'
                />
              )}
            </Box>
          ))}
        </Box>
      </ul>
    </>
  );
};

export default UsersList;
