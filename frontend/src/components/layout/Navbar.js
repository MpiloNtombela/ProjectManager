import React, {useState} from 'react';
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Link, NavLink} from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import {useDispatch, useSelector} from "react-redux";
import LinearProgress from "@material-ui/core/LinearProgress";
import Hidden from "@material-ui/core/Hidden";
import Container from "@material-ui/core/Container";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import {logout} from "../../actions/auth";

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
    a: {
      textDecoration: 'none'
    }
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    background: theme.palette.glass.dark
  },
  toolbar: {
    flexWrap: 'wrap',
    padding: theme.spacing(0, 2)
  },
  toolbarTitle: {
    flexGrow: 1,
    color: theme.palette.primary.main,
  },
  link: {
    margin: theme.spacing(1, 1.5),
    textTransform: "uppercase",
    color: "inherit",
    textDecoration: "none",
    fontSize: "small",
  },
  activeLink: {
    color: `${theme.palette.secondary.main}`,
    fontWeight: "600",
  },
  noPadding: {
    paddingLeft: 0,
    paddingRight: 0
  },
  menu: {
    "& li": {
      padding: theme.spacing(1, 2.5),
      display: "block"
    }
  }

}))


const Navbar = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logout())
  }

  return (
    <>
      <CssBaseline/>
      <AppBar
        position="sticky"
        elevation={0}
        className={classes.appBar}>
        <Container classes={{root: classes.noPadding}} maxWidth="xl">
          <Toolbar className={classes.toolbar}>
            <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
              <Link className={classes.toolbarTitle} to="/">ReCollab.io</Link>
            </Typography>
            <nav>
              {auth.isAuthenticated && auth.user ?
                <Hidden smDown>
                  <NavLink activeClassName={classes.activeLink} to="/project" className={classes.link}>
                    Projects
                  </NavLink>
                  <NavLink activeClassName={classes.activeLink} to="/profile" className={classes.link}>
                    profile
                  </NavLink>
                  <NavLink activeClassName={classes.activeLink} to="network" className={classes.link}>
                    network
                  </NavLink>
                </Hidden>
                : <>
                  <NavLink activeClassName={classes.activeLink} to="/login" className={classes.link}>
                    Login
                  </NavLink>
                  <NavLink activeClassName={classes.activeLink} to="/register" className={classes.link}>
                    register
                  </NavLink>
                </>
              }
            </nav>
            {auth.isAuthenticated && auth.user ?
              <>
                <Avatar src={auth.user.avatar}
                        aria-controls="navbar-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                        alt={auth.user.username}/>
                <Menu id="navbar-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      getContentAnchorEl={null}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }} classes={{paper: classes.menu}}>
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <Divider/>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <Divider/>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </> : <></>}
          </Toolbar>
        </Container>
      </AppBar>
      {auth.isLoading || auth.isSubmitting ? <LinearProgress/> : <></>}
    </>
  );
}
export default Navbar;
