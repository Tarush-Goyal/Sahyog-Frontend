import React, { useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import {
  InputAdornment,
  makeStyles,
  Input,
  CardActions,
  Button,
} from "@material-ui/core";
import Path from "../../Path";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles({
  button: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  input: {
    margin: 12,
  },
});
function InputPrice(props) {
  const [showpay, setShowpay] = useState(false);
  const [price, setPrice] = useState("");
  const [open, setOpen] = useState(false);
  let history = useHistory();

  const handleChange = (e) => {
    setPrice(e.target.value);
  };
  const handleClick = () => {
    setShowpay(!showpay);
    checkFundraiser();
  };

  const checkFundraiser = async () => {
    // console.log(props.fundraiser.title);

    try {
      await axios
        .get(`${Path}api/fundraiser/fetchfundraiser/${props.fundraiser.title}`)
        .then((res) => {
          if (res.data.fundraisers.length == 1) {
            console.log("yes");
          } else {
            setOpen(true);
          }
          // console.log(res);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handlePayment = async (token) => {
    let end = false;

    let finalPrice = parseInt(price) + parseInt(props.fundraiser.goalReached);
    if (finalPrice >= parseInt(props.fundraiser.goal)) {
      end = true;
    }
    console.log("final price" + finalPrice + " " + end);
    const data = {
      token,
      product: props.fundraiser,
      price: finalPrice,
      end: end,
    };
    history.push("/leaderboard");
    try {
      await axios
        .post(`${Path}api/fundraiser/makepayment`, JSON.stringify(data), {
          headers: {
            "Content-type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.statusText);
          history.push("/leaderboard");
        });
    } catch (err) {
      console.log(err);
    }
    history.push("/leaderboard");
  };

  const classes = useStyles();
  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}>
        <DialogTitle id='alert-dialog-title'>
          Fundraiser no longer exists
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            The Fundraiser you were trying to donate to has reached its goal.
            Please try donating to some other fundraiser.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            color='primary'>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <CardActions className={classes.button}>
        <Button
          variant='contained'
          size='large'
          color='primary'
          onClick={handleClick}>
          Donate
        </Button>
        {showpay && (
          <>
            <Input
              value={price}
              onChange={handleChange}
              id='standard-adornment-weight'
              className={classes.input}
              startAdornment={
                <InputAdornment position='start'>$</InputAdornment>
              }
              inputProps={{
                "aria-label": "Price",
              }}
            />
            <StripeCheckout
              token={handlePayment}
              stripeKey='pk_test_51JZBCXSHQb4CYZB3vA1m90JlPhA80BiYeazv1ke2xjMKHFIrakvYMR4PuLU46TYY5w7IbUYu8HCxeoXm3xGsCy2L00ZTZYjy77'
              name={props.fundraiser.name}
              amount={price * 100}
            />
          </>
        )}
      </CardActions>
    </>
  );
}

export default InputPrice;
