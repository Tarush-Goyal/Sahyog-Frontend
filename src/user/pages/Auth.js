import 'date-fns';
import React, { useState, useContext } from 'react';

import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
// import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SimpleTabs from '../../shared/components/material-ui/SimpleTabs';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Box from '@material-ui/core/Box';

const useStyles2 = makeStyles((theme) => ({
  root: {
    width: '100%',
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
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  input: {
    display: "none"
  },
}));

function getSteps() {
  return ['Select Type of User', 'Fill Details'];
}

const Auth = () => {
  const classes = useStyles();
  const classes2 = useStyles2();
  
  const [activeStep, setActiveStep] = React.useState(0);
  const [validation, setValidation] = useState({
    formValid: false,
      errorCount: null,
      errors: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        nameNGO: ''
      }
  })

  const handleFormChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    // const copyState={...validation};
    // const errors={...copyState.errors};
    let errors = validation.errors;

    switch (name) {
      case 'firstName': 
        errors.firstName = 
          value.length < 1
            ? 'First Name is required!'
            : '';
        break;
        case 'lastName': 
        errors.lastName = 
          value.length < 1
            ? 'Last Name is required!'
            : '';
        break;
      case 'email': 
        errors.email = 
          validEmailRegex.test(value)
            ? ''
            : 'Email is not valid!';
        break;
      case 'password': 
        errors.password = 
          value.length < 6
            ? 'Password must be 6 characters long!'
            : '';
        break;
        case 'nameNGO': 
        errors.nameNGO = 
          value.length < 1
            ? 'Name of NGO is required!'
            : '';
        break;
      default:
        break;
    }
    setValidation(
      prevState=>({
        ...prevState,
        errors:{...errors}
      })
    );
  }

  const steps = getSteps();
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  let [user1,setUser] = useState('homeowner');

  const [value, setValue] = React.useState('female');
  const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const handleChange = (event) => {
    setValue(event.target.value);
    setUser(user1=event.target.value);
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

  const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
  
  const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach(
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  }
  
  const countErrors = (errors) => {
    let count = 0;
    Object.values(errors).forEach(
      (val) => val.length > 0 && (count = count+1)
    );
    return count;
  }

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (<div style={{width:"100%"}}  flexGrow={1}>
          <h4>Select your user type</h4> 
          <FormControl component="fieldset">
      <RadioGroup aria-label="type" name="type" value={value} onChange={handleChange}>
        <FormControlLabel value="homeowner" control={<Radio />} label="Homeowner" />
        <FormControlLabel value="head" control={<Radio />} label="Head of NGO" />
        <FormControlLabel value="volunteer" control={<Radio />} label="Volunteer" />
      </RadioGroup>
    </FormControl>
    </div>);
      case 1:
        return (<form onSubmit={authSubmitHandler} className={classes.root} noValidate autoComplete="off" style={{ width: '100%' }}>

<Box display="flex" flexDirection="column" p={1} m={1} bgcolor="background.paper" style={{ width: '100%' }} justifyContent="center">
  <Box display="flex" flexDirection="row" justifyContent="space-around" m={1}>
      <TextField error={validation.errors.firstName.length>0} id="firstname" name="firstName" type="text" label="First Name" helperText={validation.errors.firstName} onBlur={handleFormChange} onChange={handleFormChange} style={{ width: '10rem' }}/>
      <TextField error={validation.errors.lastName.length>0} id="lastname" name="lastName" type="text" label="Last Name" helperText={validation.errors.lastName} onBlur={handleFormChange} onChange={handleFormChange} style={{ width: '10rem' }}/>
  </Box>
  <Box display="flex" flexDirection="row" justifyContent="space-around" m={1}>
      <TextField id="email" name="email" type="text" label="Email" error={validation.errors.email.length>0} helperText={validation.errors.email} onBlur={handleFormChange} onChange={handleFormChange} style={{ width: '10rem' }}/>
      <TextField id="password" name="password" type="text" label="Password" error={validation.errors.password.length>0} helperText={validation.errors.password} onBlur={handleFormChange} onChange={handleFormChange} style={{ width: '10rem' }}/>
  </Box>
  <Box display="flex" flexDirection="row" justifyContent="space-around" m={1}>
      {(user1==='head'||user1==='volunteer' )&&(
      <TextField id="nameNGO" name="nameNGO" type="text" label="Name of NGO" error={validation.errors.nameNGO.length>0} helperText={validation.errors.nameNGO} onBlur={handleFormChange} onChange={handleFormChange} style={{ width: '10rem' }}/>
    )}
    </Box>
    <Box display="flex" flexDirection="row" justifyContent="space-around" m={1}>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker style={{ width: '10rem' }}
          margin="normal"
          id="date-picker-dialog"
          label="Date of Birth"
          format="MM/dd/yyyy"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        </MuiPickersUtilsProvider>
        </Box>
     {user1==='head' &&( 
      <TextField id="description" name="descriptionNGO" type="text" label="Description of NGO" multiline m={1}/>
     )}
            <ImageUpload
              center
              id="image"
              errorText="Please provide a profile picture."
              style={{width:"100%"}}
              m={1}
            />

          </Box>
        </form>);
      default:
        return 'Unknown stepIndex';
    }
  }

  const authSubmitHandler = async event => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/login',
          'POST',
          JSON.stringify({
            // email: formState.inputs.email.value,
            // password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        auth.login(responseData.userId, responseData.token,);
    
      } catch (err) {}
    } else {
      try {
        var rates=document.getElementsByName('type');
      var rate_value;
      for(var i = 0; i < rates.length; i++){
          if(rates[i].checked){
              rate_value = rates[i].value;
          }
      }
        const formData = new FormData();
        // formData.append('email', formState.inputs.email.value);
        // formData.append('name', formState.inputs.name.value);
        // formData.append('password', formState.inputs.password.value);
        // formData.append('image', formState.inputs.image.value);
        formData.append('type',rate_value);
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/signup',
          'POST',
          formData
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {
        console.log("error: "+err);
      }
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {/* <Card className="authentication"> */}
        {isLoading && <LoadingSpinner asOverlay />}
        {/* <h2>Login Required</h2> */}
        {/* <hr /> */}





        <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel  style={{width:"100%"}}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div style={{width:"100%"}} flexGrow={1} >
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>All steps completed</Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div style={{width:"100%"}} flexGrow={1}>
            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
            <div style={{marginTop:"1rem"}}>
            {activeStep === steps.length - 1 && (
              <Button variant="contained" color="primary"
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              )}
              {activeStep === steps.length - 2 && (
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
        
        {/* <Button color="primary" variant="contained" onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button> */}
    </React.Fragment>
  );
};

export default Auth;