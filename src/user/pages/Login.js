import React, { useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import "./Login.css";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { AuthContext } from "../../shared/context/auth-context";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import Path from "../../shared/Path";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const Login = () => {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formValid, setFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState({
    errors: {
      email: "",
      password: "",
    },
    values: {
      email: "",
      password: "",
    },
  });

  const validEmailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/
  );

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(validation.values.email);

    try {
      const responseData = await sendRequest(
        `${Path}api/users/login`,
        "POST",
        JSON.stringify({
          email: validation.values.email,
          password: validation.values.password,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      console.log(responseData);
      auth.login(responseData.userId, responseData.token, responseData.type);
    } catch (err) {}
  };

  const handleFormChange = (event) => {
    event.preventDefault();
    setFormValid(true);
    const { name, value } = event.target;
    let errors = validation.errors;
    let values = validation.values;

    switch (name) {
      case "email":
        errors.email = validEmailRegex.test(value) ? "" : "Email is not valid!";
        values.email = value.toLowerCase();
        break;
      case "password":
        errors.password =
          value.length < 6 ? "Password must be 6 characters long!" : "";
        values.password = value;
        break;
    }

    if (errors.email.length > 1 || errors.password.length > 1) {
      setFormValid(false);
    }

    setValidation((prevState) => ({
      ...prevState,
      errors: { ...errors },
      values: { ...values },
    }));
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <div className={classes.root}>
        <h2>Login</h2>
        <hr></hr>
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
                id='email'
                name='email'
                type='text'
                label='Email'
                error={validation.errors.email.length > 0}
                helperText={validation.errors.email}
                onBlur={handleFormChange}
                onChange={handleFormChange}
                style={{ width: "15rem" }}
              />
            </Box>
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='space-around'
              m={1}>
              <TextField
                type={showPassword ? "text" : "password"}
                id='password'
                name='password'
                // type='password'
                label='Password'
                error={validation.errors.password.length > 0}
                helperText={validation.errors.password}
                onBlur={handleFormChange}
                onChange={handleFormChange}
                style={{ width: "15rem" }}
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
            <Box m={3}>
              <Button
                variant='contained'
                color='primary'
                type='submit'
                disabled={!formValid}>
                Submit
              </Button>
            </Box>
          </Box>
        </form>
      </div>
    </React.Fragment>
  );
};

export default Login;
