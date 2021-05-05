import "date-fns";
//⚠️
import React, { useEffect, useState, useContext } from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import InputAdornment from "@material-ui/core/InputAdornment";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { useForm } from "../../shared/hooks/form-hook";
import IconButton from "@material-ui/core/IconButton";
import { AuthContext } from "../../shared/context/auth-context";
import "./Signup.css";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Box from "@material-ui/core/Box";
import Path from "../../shared/Path";
import axios from "axios";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Input from "@material-ui/core/Input";

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

const Signup = () => {
  const classes = useStyles();
  const classes2 = useStyles2();
  // const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formValid, setFormValid] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [imageValid, setImageValid] = useState(false);
  const [symbol, setSymbol] = useState(true);
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
  const handleEmailChange = (value) => {
    let error = false;

    emails.every((email) => {
      if (value == email.email) {
        error = true;
        return false;
      } else {
        return true;
      }
    });
    return error;
  };

  const handleNgoChange = (value) => {
    if (user1 == "volunteer") {
      return false;
    }
    let error = false;
    ngos.every((ngo) => {
      if (value == ngo.nameNGO) {
        error = true;
        return false;
      } else {
        return true;
      }
    });
    return error;
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
        values.firstName = value.trim();
        break;
      case "lastName":
        errors.lastName = value.length < 1 ? "Last Name is required!" : "";
        values.lastName = value.trim();
        break;
      case "email":
        values.email = value.toLowerCase();
        if (value.length == 0) {
          errors.email = "Email is required!";
        } else if (handleEmailChange(value.toLowerCase())) {
          errors.email = "Email already exists!";
        } else if (!validEmailRegex.test(value)) {
          errors.email = "Email is not valid!";
        } else {
          errors.email = "";
        }
        break;
      case "password":
        errors.password =
          value.length < 6 ? "Password must be 6 characters long!" : "";
        values.password = value;
        break;
      case "nameNGO":
        console.log("entered");
        if (value.length == 0) {
          errors.nameNGO = "Name of NGO is required!";
        } else if (handleNgoChange(value)) {
          errors.nameNGO = "NGO already exists!";
        } else {
          errors.nameNGO = "";
        }
        // errors.nameNGO = value.length < 1 ? "Name of NGO is required!" : "";
        values.nameNGO = value.trim();
        break;
      case "descriptionNGO":
        values.descriptionNGO = value.trim();
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
  let [user1, setUser] = useState("homeowner");
  const [emails, setEmails] = useState([]);
  const [value, setValue] = React.useState("homeowner");
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [imageFile, setImageFile] = useState(null);
  const [ngos, setNgos] = useState([]);
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
                  type={showPassword ? "text" : "password"}
                  id='password'
                  name='password'
                  label='Password'
                  error={validation.errors.password.length > 0}
                  helperText={validation.errors.password}
                  onBlur={handleFormChange}
                  onChange={handleFormChange}
                  style={{ width: "10rem" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          onClick={() => {
                            setShowPassword(!showPassword);
                          }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
                onInput={(id, file, valid) => {
                  console.log(file);
                  setImageFile(file);
                  inputHandler(id, file, valid);
                }}
                // onInput={inputHandler}
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

  useEffect(() => {
    const ngoNames = async () => {
      try {
        const responseData = await sendRequest(`${Path}api/users/ngos`);
        setNgos(responseData.ngos);
        console.log(responseData);
      } catch (err) {}
    };
    ngoNames();
  }, [sendRequest]);

  useEffect(() => {
    const users = async () => {
      try {
        const responseData = await sendRequest(`${Path}api/users/emails`);
        setEmails(responseData.users);
        console.log(responseData);
      } catch (err) {}
    };
    users();
  }, [sendRequest]);

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    let userId;

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
      formData.append("imageGrid", imageFile.name);

      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      const responseData = await sendRequest(
        `${Path}api/users/signup`,
        "POST",
        formData
      );

      auth.login(responseData.userId, responseData.token, responseData.type);
    } catch (err) {
      console.log("error: " + err);
    }

    try {
      const data = new FormData();
      data.append("file", imageFile);
      axios.post(`${Path}api/uploads/storeimage`, data, {}).then((res) => {
        console.log(res.statusText);
      });
    } catch (err) {
      console.log(err);
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

export default Signup;
