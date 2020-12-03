import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "50rem",
    // margin: theme.spacing(1),
    backgroundColor: "#ff8a80",
  },
  inline: {
    display: "inline",
  },
}));

const SimpleList = (props) => {
  const classes = useStyles();
  if (props.items.length === 0) {
    return (
      <div className='center'>
        {/* <Card> */}
        <h2>No users found.</h2>
        {/* </Card> */}
      </div>
    );
  } else {
    // <UserItem
    //   key={user.id}
    //   id={user.id}
    //   image={user.image}
    //   name={user.name}
    //   itemCount={user.items.length}
    // />;
    return (
      <List className={classes.root}>
        {props.items.map((user) => (
          <>
            <ListItem alignItems='flex-start' key={user.id}>
              <ListItemAvatar>
                {/* image={`http://localhost:5000/${props.image}`} */}
                <Avatar
                  alt='Remy Sharp'
                  src={"http://localhost:5000/" + user.image}
                />
              </ListItemAvatar>
              <ListItemText
                primary={user.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      component='span'
                      variant='body2'
                      className={classes.inline}
                      color='textPrimary'>
                      {user.items.length + " "}
                      {user.itemCount === 1 ? "Donation" : "Donations"}
                    </Typography>
                    {/* {" — I'll be in your neighborhood doing errands this…"} */}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant='inset' component='li' />
          </>
        ))}
      </List>
    );
  }
};

export default SimpleList;
