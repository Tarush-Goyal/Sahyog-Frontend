import React, {useEffect, useState, useContext} from "react";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import {red} from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from "@material-ui/icons/Add";
import {green} from "@material-ui/core/colors";
import RemoveIcon from "@material-ui/icons/Remove";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
import Path from "../../Path";
import {useHttpClient} from "../../../shared/hooks/http-hook";
import {useAuth} from "../../../shared/hooks/auth-hook";
import Box from "@material-ui/core/Box";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 345,
    margin: theme.spacing(1)
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
}));

const MediaPaper = props => {
  const classes = useStyles();
  const [donation, setDonation] = useState([...props.items]);
  const [expanded, setExpanded] = React.useState(false);
  const {sendRequest} = useHttpClient();
  const [originalQuantity, setOriginalQuantity] = useState();
  const history = useHistory();

  useEffect(() => {
    setDonation(props.items);
  }, [props.items]);

  const handleExpandClick = index => {
    setOriginalQuantity(donation[index].quantity);
    const tempDonation = [...donation];
    if (tempDonation[index].expand) {
      tempDonation[index].expand = false;
    } else {
      tempDonation[index].expand = true;
    }
    setDonation(tempDonation);
  };

  const submitQuantity = async index => {
    console.log(donation[index]);
    try {
      const responseData = await sendRequest(
        `${Path}api/ngohead/completeRequest`,
        "POST",
        JSON.stringify({
          _id: donation[index]._id,
          quantity: donation[index].quantity,
          user_id: props.userid
        }),
        {
          "Content-Type": "application/json"
        }
      );
      history.push(`/volunteers/${props.userid}`);
    } catch (err) {}
  };

  const handleQuantityMinus = index => {
    let tempDonation = [...donation];
    tempDonation[index].quantity = +tempDonation[index].quantity - 1;
    setDonation(tempDonation);
  };

  const handleQuantityPlus = index => {
    let tempDonation = [...donation];
    tempDonation[index].quantity = +tempDonation[index].quantity + 1;
    setDonation(tempDonation);
  };

  const handleQuantityDelete = index => {
    let tempDonation = [...donation];
    tempDonation[index].quantity = 0;
    setDonation(tempDonation);
  };

  return (
    <>
      {donation && (
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          alignItems="flex-start"
        >
          {donation.map((item, index) => (
            <Card className={classes.root}>
              <CardHeader
                title={item.itemName} //name
                subheader={item.category} //category
              />
              <CardMedia
                className={classes.media}
                image={`${Path}api/uploads/singleimage/${item.imageGrid}`}
                title="Donation item" //name
              />
              <CardContent>
                <Typography
                  variant="h6"
                  component="p"
                  //quantity
                >
                  Quantity: {item.quantity}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                Edit Quantity
                <IconButton
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: expanded
                  })}
                  onClick={() => {
                    handleExpandClick(index);
                  }}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>
              <Collapse in={item.expand} timeout="auto" unmountOnExit>
                <CardContent>
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-around"
                  >
                    {donation[index].quantity < originalQuantity && (
                      <IconButton
                        aria-label="plus"
                        onClick={() => {
                          handleQuantityPlus(index);
                        }}
                      >
                        <AddIcon style={{color: green[500]}} />
                      </IconButton>
                    )}
                    {donation[index].quantity > 0 && (
                      <IconButton
                        aria-label="minus"
                        onClick={() => {
                          handleQuantityMinus(index);
                        }}
                      >
                        <RemoveIcon color="secondary" />
                      </IconButton>
                    )}
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        handleQuantityDelete(index);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      aria-label="done"
                      onClick={() => {
                        submitQuantity(index);
                      }}
                    >
                      <DoneIcon color="primary" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Collapse>
            </Card>
          ))}
        </Box>
      )}
    </>
  );
};

export default MediaPaper;
