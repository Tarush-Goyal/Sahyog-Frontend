import "date-fns";
import React, { useState, useContext } from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// import FormControl from "@material-ui/core/FormControl";
import Box from "@material-ui/core/Box";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
// import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import VolumeUp from "@material-ui/icons/VolumeUp";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import FormGroup from "@material-ui/core/FormGroup";
// import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  input: {
    display: "none",
  },
}));

const useStyles2 = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: "18rem",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const useStyles3 = makeStyles({
  root: {
    width: 250,
  },
  input: {
    width: 42,
  },
});

const DonationForm = () => {
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
    checkedF: true,
    checkedG: true,
  });
  const handleCheckedChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const classes = useStyles();
  const classes2 = useStyles2();
  const classes3 = useStyles3();
  const [quantity, setQuantity] = React.useState(0);

  const handleQuantityChange = (event, newValue) => {
    setQuantity(newValue);
  };

  const handleInputChange = (event) => {
    setQuantity(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleBlur = () => {
    if (quantity < 0) {
      setQuantity(0);
    } else if (quantity > 100) {
      setQuantity(100);
    }
  };

  const [formValid, setFormValid] = useState(false);
  const [imageValid, setImageValid] = useState(false);
  const [validation, setValidation] = useState({
    errors: {
      itemName: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      house: "",
      landmark: "",
    },
    values: {
      itemName: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
    },
  });

  const [category, setCategory] = React.useState("");

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const imageChange = () => {
    console.log("entered");
    setFormValid(true);
    setImageValid(formState.isValid);
    if (
      validation.errors.firstName.length > 1 ||
      validation.errors.lastName.length > 1 ||
      validation.errors.email.length > 1 ||
      validation.errors.password.length > 1 ||
      validation.errors.nameNGO.length > 1
    ) {
      setFormValid(false);
    }
  };

  const handleFormChange = (event) => {
    event.preventDefault();
    setFormValid(true);
    const { name, value } = event.target;
    // const copyState={...validation};
    // const errors={...copyState.errors};
    let errors = validation.errors;
    let values = validation.values;

    switch (name) {
      case "itemName":
        errors.itemName = value.length < 1 ? "Item Name is required!" : "";
        values.itemName = value;
        break;
      case "street":
        errors.street = value.length < 1 ? "Street/Locality is required!" : "";
        values.street = value;
        break;
      case "city":
        errors.city = value.length < 1 ? "City is required!" : "";
        values.city = value;
        break;
      case "state":
        errors.state = value.length < 1 ? "State is required!" : "";
        values.state = value;
        break;
      case "house":
        errors.house = value.length < 1 ? "House no is required!" : "";
        values.house = value;
        break;
      case "landmark":
        errors.landmark = value.length < 1 ? "Landmark is required!" : "";
        values.landmark = value;
        break;
      case "pincode":
        errors.pincode = value.length < 1 ? "Pincode is required!" : "";
        values.pincode = value;
        break;
      default:
        break;
    }

    if (
      errors.itemName.length > 1 ||
      errors.street.length > 1 ||
      errors.city.length > 1 ||
      errors.state.length > 1 ||
      errors.house.length > 1 ||
      errors.pincode.length > 1 ||
      errors.landmark.length > 1 ||
      imageValid === false
    ) {
      setFormValid(false);
    }

    setValidation((prevState) => ({
      ...prevState,
      errors: { ...errors },
      values: { ...values },
    }));
  };

  const auth = useContext(AuthContext);
  let [user1, setUser] = useState("homeowner");
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const validEmailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("email", validation.values.email);
      formData.append("firstName", validation.values.firstName);
      formData.append("lastName", validation.values.lastName);
      formData.append("password", validation.values.password);
      formData.append("nameNGO", validation.values.nameNGO);
      formData.append("descriptionNGO", validation.values.descriptionNGO);
      formData.append("date", selectedDate);
      formData.append("image", formState.inputs.image.value);
      // formData.append("type", value);

      // for (var pair of formData.entries()) {
      //   console.log(pair[0] + ", " + pair[1]);
      // }

      const responseData = await sendRequest(
        "http://localhost:5000/api/users/signup",
        "POST",
        formData
      );

      auth.login(responseData.userId, responseData.token);
    } catch (err) {
      console.log("error: " + err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      {isLoading && <LoadingSpinner asOverlay />}

      <div className={classes.root}>
        <Box display='flex' flexDirection='column' style={{ width: "100%" }}>
          <Box
            display='flex'
            flexDirection='row'
            justifyContent='center'
            style={{ width: "100%" }}>
            <h2>Donation Form</h2>
          </Box>
          <Box display='flex' flexDirection='row' justifyContent='center'>
            <hr style={{ width: "80%" }}></hr>
          </Box>
        </Box>
        <form
          onSubmit={authSubmitHandler}
          className={classes.root}
          noValidate
          autoComplete='off'
          style={{ width: "100%" }}>
          <Box
            display='flex'
            flexDirection='column'
            p={1}
            m={1}
            bgcolor='background.paper'
            style={{ width: "100%" }}>
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='space-around'
              m={1}>
              <TextField
                error={validation.errors.itemName.length > 0}
                id='itemName'
                name='itemName'
                type='text'
                label='Name of Item'
                helperText={validation.errors.itemName}
                onBlur={handleFormChange}
                onChange={handleFormChange}
                style={{ width: "20rem" }}
              />
            </Box>
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='space-around'
              m={1}>
              <FormControl className={classes2.formControl}>
                <InputLabel id='demo-simple-select-label'>Category</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={category}
                  onChange={handleCategoryChange}>
                  <MenuItem value={"clothes"}>Clothes</MenuItem>
                  <MenuItem value={"shoes"}>Shoes</MenuItem>
                  <MenuItem value={"books"}>Books</MenuItem>
                  <MenuItem value={"food"}>Food</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='space-around'
              m={1}>
              <div className={classes3.root}>
                <Typography id='input-slider' gutterBottom>
                  Quantity
                </Typography>
                <Grid container spacing={2} alignItems='center'>
                  <Grid item xs>
                    <Slider
                      value={typeof quantity === "number" ? quantity : 0}
                      onChange={handleQuantityChange}
                      aria-labelledby='input-slider'
                      step={1}
                      marks
                      min={1}
                      max={10}
                      valueLabelDisplay='auto' //to display value while sliding
                    />
                  </Grid>
                  <Grid item>
                    <Input
                      className={classes3.input}
                      value={quantity}
                      margin='dense'
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      inputProps={{
                        step: 10,
                        min: 0,
                        max: 100,
                        type: "number",
                        "aria-labelledby": "input-slider",
                      }}
                    />
                  </Grid>
                </Grid>
              </div>
            </Box>
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='space-around'
              m={1}></Box>
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='space-around'
              m={1}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  style={{ width: "10rem" }}
                  margin='normal'
                  id='date-picker-dialog'
                  label='Pickup Date'
                  format='MM/dd/yyyy'
                  value={selectedDate}
                  name='date'
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </Box>
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='space-around'
              m={1}>
              <ImageUpload
                id='image'
                center
                name='image'
                errorText='Please provide picture of item'
                onInput={inputHandler}
                updateImage={(event) => {
                  imageChange();
                }}
                m={1}
              />
            </Box>
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='space-around'
              m={1}>
              <TextField
                error={validation.errors.street.length > 0}
                id='street'
                name='street'
                type='text'
                label='Street/Locality'
                helperText={validation.errors.street}
                onBlur={handleFormChange}
                onChange={handleFormChange}
                style={{ width: "30rem" }}
                multiline
              />
            </Box>
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='space-around'
              m={1}>
              <TextField
                error={validation.errors.landmark.length > 0}
                id='landmark'
                name='landmark'
                type='text'
                label='Nearby Landmark'
                helperText={validation.errors.landmark}
                onBlur={handleFormChange}
                onChange={handleFormChange}
                style={{ width: "30rem" }}
              />
            </Box>
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='space-around'
              m={1}>
              <TextField
                error={validation.errors.city.length > 0}
                id='city'
                name='city'
                type='text'
                label='City'
                helperText={validation.errors.city}
                onBlur={handleFormChange}
                onChange={handleFormChange}
                style={{ width: "10rem" }}
              />
              <TextField
                error={validation.errors.state.length > 0}
                id='state'
                name='state'
                type='text'
                label='State'
                helperText={validation.errors.state}
                onBlur={handleFormChange}
                onChange={handleFormChange}
                style={{ width: "10rem" }}
              />
            </Box>
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='space-around'
              m={1}>
              <TextField
                error={validation.errors.pincode.length > 0}
                id='pincode'
                name='pincode'
                type='text'
                label='Pincode'
                helperText={validation.errors.pincode}
                onBlur={handleFormChange}
                onChange={handleFormChange}
                style={{ width: "10rem" }}
              />

              <TextField
                error={validation.errors.house.length > 0}
                id='house'
                name='house'
                type='text'
                label='House No'
                helperText={validation.errors.house}
                onBlur={handleFormChange}
                onChange={handleFormChange}
                style={{ width: "5rem" }}
              />
            </Box>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.checkedB}
                    onChange={handleCheckedChange}
                    name='checkedB'
                    color='primary'
                  />
                }
                label='Save Address'
              />
            </FormGroup>
          </Box>

          <Button
            variant='contained'
            color='primary'
            type='submit'
            disabled={!formValid}>
            Submit
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default DonationForm;