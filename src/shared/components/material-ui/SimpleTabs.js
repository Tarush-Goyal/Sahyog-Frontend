import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

// import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import Auth from '../../../user/pages/Auth';
import Card from '../UIElements/Card';
import './SimpleTabs.css';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Container>
        <Box>
            {children}
        </Box>
    </Container>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width:'100%',
    // backgroundColor: theme.palette.background.paper,
  },
//   rootCard: {
//     maxWidth: 275,
//   },
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (

    
    <div className={classes.root}>
        {/* <Card className={classes.rootCard}> */}
        {/* <CardContent> */}
        <Card className="authentication">
      <AppBar position="static">
      {/* <Paper square> */}
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example"  variant="fullWidth"
          >
          <Tab label="Login" {...a11yProps(0)} />
          
          {/* <Tab lavel="dfrgtyhuj" {...a11yProps(1)}/> */}
          <Tab label="Signup" style={{paddingLeft: 0, paddingRight: 0}} {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      {/* </Paper> */}
      <TabPanel value={value} index={0}>
        Login
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Auth></Auth>
        {/* werty */}
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      {/* </CardContent> */}
    {/* </Card> */}
    </Card>
    </div>
    
  );
}
