import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Path from "../../shared/Path";

class VolunteerID extends React.PureComponent {
  componentDidMount() {
    console.log("Mounted");
    console.log(this.props);
  }

  render() {
    return (
      <Card style={{ padding: "2rem", maxWidth: 345 }}>
        <CardHeader
          title={this.props.data.name}
          subheader={this.props.data.email}
        />
        <img
          style={{ display: "none" }}
          src={`${Path}api/uploads/singleimage/${this.props.data.imageGrid}`}
        />
        <CardMedia
          style={{ height: 0, paddingTop: "56.25%" }}
          image={`${Path}api/uploads/singleimage/${this.props.data.imageGrid}`}
        />
        <CardContent>
          <Typography variant='body1' color='textSecondary' component='p'>
            Name of NGO: {this.props.data.nameNGO}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default VolunteerID;
