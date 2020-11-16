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
// import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
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
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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

// function getStepContent(stepIndex) {
//   switch (stepIndex) {
//     case 0:
//       return (<div>
//         <p>Select your user type</p>
//         <input type="radio" id="homeowner" name="type" value="homeowner" defaultChecked onClick={Auth.switchUserHandler}/>homeowner
//         <input type="radio" id="head" name="type" value="head" onClick={Auth.switchUserHandler}/>head
//         <input type="radio" id="volunteer" name="type" value="volunteer" onClick={Auth.switchUserHandler}/>volunteer    
//         </div>);
//     case 1:
//       return 'What is an ad group anyways?';
//     case 2:
//       return 'This is the bit I really care about!';
//     default:
//       return 'Unknown stepIndex';
//   }
// }

const Auth = () => {
  const classes = useStyles();
  const classes2 = useStyles2();
  
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  let [user1,setUser] = useState('homeowner');
  const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

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
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (<div>
          <p>Select your user type</p>
          <input type="radio" id="homeowner" name="type" value="homeowner" defaultChecked onClick={Auth.switchUserHandler}/>homeowner
          <input type="radio" id="head" name="type" value="head" onClick={switchUserHandler}/>head
          <input type="radio" id="volunteer" name="type" value="volunteer" onClick={switchUserHandler}/>volunteer    
          </div>);
      case 1:
        return (<form onSubmit={authSubmitHandler} className={classes.root} noValidate autoComplete="off">

  
      <TextField id="standard-basic" type="text" label="First Name" />
      <TextField id="standard-basic" type="text" label="Last Name" />
      <TextField id="standard-basic" type="text" label="Email" />
      <TextField id="standard-basic" type="text" label="Password" />
      <TextField id="standard-basic" type="text" label="Name of NGO" />
      <TextField id="standard-basic" type="text" label="Address" multiline />
      <TextField id="standard-basic" type="text" label="Description" multiline />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Date picker dialog"
          format="MM/dd/yyyy"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        </MuiPickersUtilsProvider>
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image."
            />
          {/* )} */}

          
          <Button color="primary" variant="contained" type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>);
      case 2:
        return 'This is the bit I really care about!';
      default:
        return 'Unknown stepIndex';
    }
  }

    const switchUserHandler = () => {
      console.log("YESSS");
      let user = document.getElementsByName('type');
      let userType;
      for(let i = 0; i < user.length; i++){
          if(user[i].checked){
              userType = user[i].value;
          }
      }
      setUser(user1=userType);
    }

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          },
          image: {
            value: null,
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
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
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);
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
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>All steps completed</Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>








        
        <Button color="primary" variant="contained" onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
{/* <SimpleTabs></SimpleTabs> */}
      {/* </Card> */}
    </React.Fragment>
  );
};

export default Auth;