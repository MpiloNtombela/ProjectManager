import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import BottomDrawer from "../layout/BottomDrawer";
import Hidden from "@material-ui/core/Hidden";
import TextBottomIconButton from "../layout/TextBottomIconButton";
import { useSelector } from "react-redux";
import {
  ViewWeek,
  Attachment,
  History,
  BubbleChart,
  Menu,
  PersonAdd,
  Tune,
} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import InvitationCard from "./projectActions/InvitationCard";

const drawerWidth = 75;

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: theme.palette.background.paper + theme.palette.alpha['80'],
    color: theme.palette.primary.main,
  },
  toolbar: {
    padding: theme.spacing(0, 1),
  },
  drawer: {
    width: drawerWidth,
    border: 0,
    flexShrink: 0,
    whiteSpace: "nowrap",
    overflowX: "hidden",
    scrollbarWidth: "tiny",
    "&::-webkit-scrollbar": {
      width: ".25rem",
    },
    "&::-webkit-scrollbar-thumb": {
      background: theme.palette.secondary.light,
    },
  },
  menuFab: {
    position: "fixed",
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
}));

export default function ProjectDrawer() {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(false);
  const classes = useStyles();
  const { project } = useSelector((state) => state.projectsState);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    if (!open) return;
    setOpen(false);
  };

  const handleInviteClick = (e) => {
    if (!project.is_creator) return;
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  const actionButtons = [
    {
      name: "Project",
      icon: <ViewWeek />,
      func: handleClose,
    },
    {
      name: "Attachments",
      icon: <Attachment />,
      func: handleClose,
    },
    {
      name: "Logs",
      icon: <History />,
      func: handleClose,
    },
    {
      name: "Test",
      icon: <PersonAdd />,
      func: handleClose,
    },
  ];

  return (
    <div>
      <AppBar elevation={0} position="fixed" className={classes.appBar}>
        <Toolbar variant="dense" className={classes.toolbar}>
          <Box sx={{ ml: 1, mr: 2 }}>
            <BubbleChart fontSize={"large"} color={"primary"} />
          </Box>
          {project && (
            <>
              <Typography
                noWrap
                overflow="ellipses"
                variant="h6"
                component="h6"
                color={"textPrimary"}
                sx={{ flexGrow: 1 }}>
                {project.name}
              </Typography>

              <IconButton size={"medium"} onClick={handleInviteClick}>
                <PersonAdd />
              </IconButton>
              <IconButton size={"medium"}>
                <Tune />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Hidden smDown>
        <Drawer variant="permanent" classes={{ paper: classes.drawer }}>
          <Box sx={{ mb: 6 }} />
          <List>
            {actionButtons.map(({ name, icon, func }, idx) => (
              <ListItem button key={idx}>
                <TextBottomIconButton icon={icon} text={name} onClick={func} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Hidden>
      <Hidden smUp>
        <BottomDrawer open={open} setOpen={setOpen}>
          <Grid sx={{ my: 1 }} container spacing={2}>
            {actionButtons.map(({ name, icon, func }, idx) => (
              <Grid item xs key={idx}>
                <TextBottomIconButton icon={icon} text={name} />
              </Grid>
            ))}
          </Grid>
        </BottomDrawer>
        <Fab
          className={classes.menuFab}
          onClick={handleOpen}
          size={"small"}
          color={"secondary"}
          aria-label="open menu">
          <Menu />
        </Fab>
      </Hidden>
      {project && <InvitationCard id={project.id} anchorEl={anchorEl} setAnchorEl={setAnchorEl}/>}
    </div>
  );
}
