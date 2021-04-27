import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ProjectPageSkeleton from "../skeletons/projects/ProjectPageSkeleton";
import Boards from "./boards/Boards";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import PersonAdd from "@material-ui/icons/PersonAdd";
import InvitationPopper from "./projectActions/InvitationAction";

const useStyles = makeStyles((theme) => {
  const BACKGROUND =
    theme.palette.mode === "light" ? "#eee" : theme.palette.background.default;

  return {
    root: {
      position: "fixed",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      overflowY: "auto",
      minWidth: "100%",
      scrollbarWidth: "tiny",
      "&::-webkit-scrollbar": {
        width: ".25rem",
      },
    },
    hideScroll: {
      overflow: "auto",
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    projectContainer: {
      height: "100%",
    },
    projectBar: {
      position: "sticky",
      left: 0,
      textTransform: "capitalize",
    },
    projectBoardsGrid: {
      display: "grid",
      gridAutoColumns: "270px",
      gridAutoFlow: "column",
      "&:last-child": {
        paddingRight: ".75rem",
      },
    },
    rootBar: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
    toolbar: {
      minHeight: "2.25rem",
      maxHeight: "2.25rem",
      background: BACKGROUND,
      color: theme.palette.getContrastText(BACKGROUND),
    },
    projectBarButtons: {
      fontSize: "small",
    },
    inviteCard: {
      textAlign: "center",
    },
    caution: {
      color: theme.palette.grey[700],
      fontSize: "xx-small",
    },
  };
});

const ProjectBar = ({ title, id }) => {
  const classes = useStyles();
  const [inviteAnchorEl, setInviteAnchorEl] = useState(null);

  const handleInviteClick = (e) => {
    setInviteAnchorEl(inviteAnchorEl ? null : e.currentTarget);
  };
  return (
    <div className={classes.rootBar}>
      <AppBar position="static" elevation={0}>
        <Toolbar variant={"dense"} disableGutters className={classes.toolbar}>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <Button
            className={classes.projectBarButtons}
            size={"small"}
            variant={"contained"}
            disableElevation
            onClick={handleInviteClick}>
            <PersonAdd fontSize={"small"} /> Invite
          </Button>
        </Toolbar>
      </AppBar>
      <InvitationPopper
        id={id}
        anchorEl={inviteAnchorEl}
        setAnchorEl={setInviteAnchorEl}
      />
    </div>
  );
};

const ProjectView = ({ isLoading, isError }) => {
  const classes = useStyles();
  const {project} = useSelector((state) => state.projectsState);
  const boardsState = useSelector((state) => state.boardsState);

  if (isLoading) return <ProjectPageSkeleton />;

  if (isError) return <Typography>Failed to load project</Typography>;

  return (
    <Container
      className={`${classes.hideScroll} ${classes.projectContainer}`}
      maxWidth="xl">
      <div className={classes.projectBar}>
        <ProjectBar title={project.name} id={project.id} />
      </div>
      <Box sx={{ py: 3 }}>
        <Grid container className={classes.projectBoardsGrid} spacing={1}>
          {boardsState.boards ? (
            <Boards />
          ) : (
            <Typography variant={"h1"} color={"error"}>
              Failed to load boards
            </Typography>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

ProjectBar.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

ProjectView.propTypes = {
  token: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
};

export default ProjectView;
