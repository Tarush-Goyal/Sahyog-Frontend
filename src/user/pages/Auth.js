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
import FormControl from "@material-ui/core/FormControl";
import Box from "@material-ui/core/Box";

const useStyles2 = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

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

function getSteps() {
  return ["Select Type of User", "Fill Details"];
}

const Auth = () => {
  const classes = useStyles();
  const classes2 = useStyles2();

  const [formValid, setFormValid] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [imageValid, setImageValid] = useState(false);
  const [validation, setValidation] = useState({
    errors: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      nameNGO: "",
    },
    values: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      nameNGO: "",
      descriptionNGO: "",
    },
  });

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
      case "firstName":
        errors.firstName = value.length < 1 ? "First Name is required!" : "";
        values.firstName = value;
        break;
      case "lastName":
        errors.lastName = value.length < 1 ? "Last Name is required!" : "";
        values.lastName = value;
        break;
      case "email":
        errors.email = validEmailRegex.test(value) ? "" : "Email is not valid!";
        values.email = value;
        break;
      case "password":
        errors.password =
          value.length < 6 ? "Password must be 6 characters long!" : "";
        values.password = value;
        break;
      case "nameNGO":
        errors.nameNGO = value.length < 1 ? "Name of NGO is required!" : "";
        values.nameNGO = value;
        break;
      case "descriptionNGO":
        values.descriptionNGO = value;
        break;
      default:
        break;
    }

    if (
      errors.firstName.length > 1 ||
      errors.lastName.length > 1 ||
      errors.email.length > 1 ||
      errors.password.length > 1 ||
      errors.nameNGO.length > 1 ||
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

  const steps = getSteps();
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(false);
  let [user1, setUser] = useState("homeowner");

  const [value, setValue] = React.useState("female");
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const handleChange = (event) => {
    setValue(event.target.value);
    setUser((user1 = event.target.value));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

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

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <div style={{ width: "100%" }}>
            <h4>Select your user type</h4>
            <FormControl component='fieldset'>
              <RadioGroup
                aria-label='type'
                name='type'
                value={value}
                onChange={handleChange}>
                <FormControlLabel
                  value='homeowner'
                  control={<Radio />}
                  label='Homeowner'
                />
                <FormControlLabel
                  value='head'
                  control={<Radio />}
                  label='Head of NGO'
                />
                <FormControlLabel
                  value='volunteer'
                  control={<Radio />}
                  label='Volunteer'
                />
              </RadioGroup>
            </FormControl>
          </div>
        );
      case 1:
        return (
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
                  error={validation.errors.firstName.length > 0}
                  id='firstname'
                  name='firstName'
                  type='text'
                  label='First Name'
                  helperText={validation.errors.firstName}
                  onBlur={handleFormChange}
                  onChange={handleFormChange}
                  style={{ width: "10rem" }}
                />
                <TextField
                  error={validation.errors.lastName.length > 0}
                  id='lastname'
                  name='lastName'
                  type='text'
                  label='Last Name'
                  helperText={validation.errors.lastName}
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
                  id='email'
                  name='email'
                  type='text'
                  label='Email'
                  error={validation.errors.email.length > 0}
                  helperText={validation.errors.email}
                  onBlur={handleFormChange}
                  onChange={handleFormChange}
                  style={{ width: "10rem" }}
                />
                <TextField
                  id='password'
                  name='password'
                  type='password'
                  label='Password'
                  error={validation.errors.password.length > 0}
                  helperText={validation.errors.password}
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
                {(user1 === "head" || user1 === "volunteer") && (
                  <TextField
                    id='nameNGO'
                    name='nameNGO'
                    type='text'
                    label='Name of NGO'
                    error={validation.errors.nameNGO.length > 0}
                    helperText={validation.errors.nameNGO}
                    onBlur={handleFormChange}
                    onChange={handleFormChange}
                    style={{ width: "10rem" }}
                  />
                )}
              </Box>
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
                    label='Date of Birth'
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
              {user1 === "head" && (
                <TextField
                  id='descriptionNGO'
                  name='descriptionNGO'
                  type='text'
                  label='Description of NGO'
                  multiline
                  onBlur={handleFormChange}
                  onChange={handleFormChange}
                  m={1}
                />
              )}
              <ImageUpload
                center
                id='image'
                name='image'
                errorText='Please provide a profile picture'
                style={{ width: "100%" }}
                onInput={inputHandler}
                updateImage={(event) => {
                  imageChange();
                }}
                m={1}
              />
            </Box>

            <Button
              variant='contained'
              color='primary'
              type='submit'
              disabled={!formValid}>
              Submit
            </Button>
          </form>
        );
      default:
        return "Unknown stepIndex";
    }
  };

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
      formData.append("type", value);

      // for (var pair of formData.entries()) {
      //   console.log(pair[0] + ", " + pair[1]);
      // }

      const responseData = await sendRequest(
        "http://localhost:5000/api/users/signup",
        "POST",
        formData
      );

      auth.login(responseData.userId, responseData.token, responseData.type);
    } catch (err) {
      console.log("error: " + err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <div className={classes.root}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          style={{ width: "100%" }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div style={{ width: "100%" }}>
          {activeStep === steps.length ? (
            <div></div>
          ) : (
            <div style={{ width: "100%" }}>
              <Typography className={classes.instructions}>
                {getStepContent(activeStep)}
              </Typography>
              <div style={{ marginTop: "1rem" }}>
                {activeStep === steps.length - 1 && (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleBack}
                    className={classes.backButton}>
                    Back
                  </Button>
                )}
                {activeStep === steps.length - 2 && (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleNext}>
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Auth;
