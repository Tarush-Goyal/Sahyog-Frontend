import React, { useState, useContext } from "react";
import ErrorModal from "../../components/UIElements/ErrorModal";
import LoadingSpinner from "../../components/UIElements/LoadingSpinner";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import { useHttpClient } from "../../hooks/http-hook";
import SimplePaper from "../material-ui/SimplePaper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField";
import ImageUpload from "../../components/FormElements/ImageUpload";
import Button from "@material-ui/core/Button";
import { useForm } from "../../hooks/form-hook";
import Path from "../../Path";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

const useStyles = makeStyles({
  root: {
    width: 500,
  },
});

const marks = [
  {
    value: 1000,
    label: "$1000",
  },
  {
    value: 2000,
    label: "$2000",
  },
  {
    value: 3000,
    label: "$3000",
  },
  {
    value: 4000,
    label: "$4000",
  },
  {
    value: 5000,
    label: "$5000",
  },
  {
    value: 6000,
    label: "$6000",
  },
  {
    value: 7000,
    label: "$7000",
  },
  {
    value: 8000,
    label: "$8000",
  },
  {
    value: 9000,
    label: "$9000",
  },
  {
    value: 10000,
    label: "$10000",
  },
];

const CreateFundraiser = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const classes = useStyles();
  let history = useHistory();
  const auth = useContext(AuthContext);
  const [imageValid, setImageValid] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [goal, setGoal] = React.useState(1);
  const [validation, setValidation] = useState({
    errors: {
      title: "",
      desc: "",
      goal: "",
    },
    values: {
      title: "",
      desc: "",
      goal: 0,
    },
  });
  const [formState, inputHandler] = useForm(
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

  const imageChange = () => {
    setFormValid(true);
    setImageValid(formState.isValid);
    if (validation.errors.title.length > 1) {
      setFormValid(false);
    }
  };

  const handleFormChange = (event) => {
    event.preventDefault();
    setFormValid(true);
    const { name, value } = event.target;
    let errors = validation.errors;
    let values = validation.values;

    switch (name) {
      case "title":
        errors.title = value.length < 1 ? "Title is required!" : "";
        values.title = value.trim();
        break;
      case "desc":
        errors.desc = value.length < 1 ? "Description is required!" : "";
        values.desc = value.trim();
        break;
      default:
        break;
    }

    if (errors.title.length > 1 || imageValid === false) {
      setFormValid(false);
    }
    setValidation((prevState) => ({
      ...prevState,
      errors: { ...errors },
      values: { ...values },
    }));
  };

  const handleQuantityChange = (event, newValue) => {
    setGoal(newValue);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    let data = {
      title: validation.values.title,
      desc: validation.values.desc,
      imageGrid: imageFile.name,
      goal: goal,
    };
    console.log(data);

    try {
      axios
        .post(`${Path}api/fundraiser/create`, JSON.stringify(data), {
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
    history.push("/");

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
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}

      <SimplePaper title='Create New Fundraiser'></SimplePaper>

      <Card>
        <form onSubmit={authSubmitHandler} noValidate autoComplete='off'>
          <Box display='flex' flexDirection='column' m={2}>
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='space-around'
              m={2}>
              <Box display='flex' flexDirection='column'>
                <Typography>Set Title of Fundraiser</Typography>
                <TextField
                  variant='outlined'
                  id='title'
                  name='title'
                  label='Title*'
                  onBlur={handleFormChange}
                  onChange={handleFormChange}
                  helperText={validation.errors.title}
                  error={validation.errors.title.length > 0}
                  style={{ width: "20rem" }}
                />
              </Box>
            </Box>
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='space-around'
              m={2}>
              <Box display='flex' flexDirection='column'>
                <Typography>Please provide a picture</Typography>
                <ImageUpload
                  center
                  id='image'
                  name='image'
                  style={{ width: "100%" }}
                  onInput={(id, file, valid) => {
                    console.log(file);
                    setImageFile(file);
                    inputHandler(id, file, valid);
                  }}
                  updateImage={(event) => {
                    imageChange();
                  }}
                  m={1}
                />
              </Box>
            </Box>
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='space-around'
              m={2}>
              <Box display='flex' flexDirection='column'>
                <Typography>Enter Fundraiser Description</Typography>
                <TextField
                  variant='outlined'
                  id='desc'
                  name='desc'
                  label='Description*'
                  multiline
                  rows='4'
                  onBlur={handleFormChange}
                  onChange={handleFormChange}
                  helperText={validation.errors.desc}
                  error={validation.errors.desc.length > 0}
                  style={{ width: "30rem" }}
                />
              </Box>
            </Box>

            <Box
              display='flex'
              flexDirection='row'
              justifyContent='space-around'
              m={2}>
              <Box display='flex' flexDirection='column'>
                <Typography>Set Donation Goal</Typography>
                <Slider
                  className={classes.root}
                  defaultValue={1000}
                  step={1000}
                  min={1000}
                  max={10000}
                  marks={marks}
                  onChange={handleQuantityChange}
                />
              </Box>
            </Box>
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='space-around'
              m={2}>
              <Box display='flex' flexDirection='column'>
                <Button
                  variant='contained'
                  color='primary'
                  type='submit'
                  style={{ width: "16rem" }}>
                  Submit
                </Button>
              </Box>
            </Box>
          </Box>
        </form>
      </Card>
    </>
  );
};

export default CreateFundraiser;
