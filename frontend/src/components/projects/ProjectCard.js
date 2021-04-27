import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import { ExpandMore, Share } from "@material-ui/icons";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import InvitationPopper from "./projectActions/InvitationAction";

const useStyles = makeStyles((theme) => ({
  card: {
    height: "100%",
    "&:hover": {
      boxShadow: `0 0 .50rem 0px ${theme.palette.primary.light}`,
    },
  },
  cardContent: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  title: {
    fontWeight: "bold",
    opacity: ".85",
  },
}));

const ProjectCard = ({ project }) => {
  const classes = useStyles();
  const history = useHistory();
  const handleOpenProject = (id) => history.push(`/project/${id}`);

  const [inviteAnchorEl, setInviteAnchorEl] = useState(null);

  const handleExpandClick = (e) => {
    if (!project.is_creator) return;
    setInviteAnchorEl(inviteAnchorEl ? null : e.currentTarget);
  };

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar
            aria-label="creator"
            className={classes.avatar}
            src={project.creator.avatar}
            alt={project.creator.username}
          />
        }
        title={project.creator.username}
        subheader="September 14, 2016"
        action={
          project.is_creator && (
            <IconButton size={"small"} onClick={handleExpandClick}>
              <ExpandMore />
            </IconButton>
          )
        }
      />
      <CardContent
        className={classes.cardContent}
        onClick={() => {
          handleOpenProject(project.id);
        }}>
        <Typography
          className={classes.title}
          variant={"subtitle1"}
          color="textPrimary"
          component="h2">
          {project.name}
        </Typography>
      </CardContent>
      {project.is_creator && (
        <InvitationPopper
          id={project.id}
          anchorEl={inviteAnchorEl}
          setAnchorEl={setInviteAnchorEl}
        />
      )}
    </Card>
  );
};
ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
};
export default ProjectCard;
