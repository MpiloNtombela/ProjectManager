import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/core/AvatarGroup";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import { ExpandMore, StarsRounded } from "@material-ui/icons";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import InvitationPopper from "./projectActions/InvitationCard";
import Badge from "@material-ui/core/Badge";

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
  badge: {
    right: "20%",
    bottom: "15%",
  },
  adminIcon: {
    height: ".75rem",
    width: ".75rem",
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
          <AvatarGroup max={4}>
            {project.members.map((member) => (
              <div key={member.id}>
                {project.creator.id === member.id ? (
                  <Badge
                    classes={{ badge: classes.badge }}
                    overlap={"circular"}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      <StarsRounded
                        color={"secondary"}
                        classes={{ root: classes.adminIcon }}
                        fontSize={"small"}
                      />
                    }>
                    <Avatar alt={member.username} src={member.avatar} />
                  </Badge>
                ) : (
                  <Avatar src={member.avatar} alt={"mpiloh"} />
                )}
              </div>
            ))}
          </AvatarGroup>
        }
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
          variant={"h6"}
          color="textPrimary"
          component="h6">
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
