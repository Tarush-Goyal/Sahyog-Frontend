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
  let history = useHistory();

  const handleChange = (e) => {
    setPrice(e.target.value);
  };
  const handleClick = () => {
    setShowpay(!showpay);
  };
  const handlePayment = (token) => {
    const data = {
      token,
      product: props.fundraiser,
      price: parseInt(price) + parseInt(props.fundraiser.goalReached),
    };
    try {
      axios
        .post(`${Path}api/fundraiser/makepayment`, JSON.stringify(data), {
          headers: {
            "Content-type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.statusText);
        });
    } catch (err) {
      console.log(err);
    }
    history.push("/leaderboard");
  };

  const classes = useStyles();
  return (
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
            startAdornment={<InputAdornment position='start'>$</InputAdornment>}
            inputProps={{
              "aria-label": "Price",
            }}
          />
          <StripeCheckout
            token={handlePayment}
            stripeKey='pk_test_51IgnbRSEzonCch7wpM8MTTFXNQVU2ll3iLYZvBovrB3R6sOblAj9Xx1Zlzmf4v8LY6iPpcJ317CfqA00UF93E69j00eZmXQOjD'
            name={props.fundraiser.name}
            amount={price * 100}
          />
        </>
      )}
    </CardActions>
  );
}

export default InputPrice;
