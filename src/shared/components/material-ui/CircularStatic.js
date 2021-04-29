import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

function CircularProgressWithLabel(props) {
  return (
    <Box position='relative' display='inline-flex'>
      <CircularProgress variant='determinate' size={200} {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position='absolute'
        display='flex'
        alignItems='center'
        justifyContent='center'>
        <Typography variant='h6' component='div' color='textPrimary'>
          <Typography variant='h2' component='div' color='initial'>
            Goal
          </Typography>
          $ {props.goalReached}/{props.goal}
        </Typography>
      </Box>
    </Box>
  );
}

export default function CircularStatic(props) {
  const progress = (props.goalReached / props.goal) * 100;

  return (
    <CircularProgressWithLabel
      goal={props.goal}
      goalReached={props.goalReached}
      value={progress}
    />
  );
}
