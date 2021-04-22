import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import {ExpandMore, Favorite, Share} from "@material-ui/icons";
import PropTypes from 'prop-types';
import React from 'react';
import {useHistory} from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  cardContent: {
    height: '100%',
    "&:hover": {
      boxShadow: `0 0 .50rem 0px ${theme.palette.primary.light}`,
      cursor: 'pointer'
    }
  },
  title: {
    fontWeight: 'bold',
    opacity: '.85'
  },
}));

const ProjectCard = ({project}) => {
  const classes = useStyles();
  const history = useHistory();
  const handleOpenProject = (id) => history.push(`/project/${id}`)
  return (
    <Card className={classes.card}>
      {!project.is_creator ?
        <CardHeader
          avatar={<Avatar aria-label="creator" className={classes.avatar}
                          src={project.creator.avatar} alt={project.creator.username}/>}
          title={project.creator.username}
          subheader="September 14, 2016"
        />
        : <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <Favorite/>
          </IconButton>
          <IconButton aria-label="share">
            <Share/>
          </IconButton>
          <IconButton>
            <ExpandMore/>
          </IconButton>
          <Divider/>
        </CardActions>}
      <CardContent onClick={() => {
        handleOpenProject(project.id)
      }}>
        <Typography className={classes.title} variant={"subtitle1"} color="textPrimary" component="h2">
          {project.name}
        </Typography>
      </CardContent>
    </Card>
  );
};
ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
}
export default ProjectCard;