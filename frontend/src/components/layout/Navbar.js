import * as React from 'react';
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Link, NavLink} from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import {connect} from "react-redux";
import LinearProgress from "@material-ui/core/LinearProgress";
import Hidden from "@material-ui/core/Hidden";
import Container from "@material-ui/core/Container";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import {logout} from "../../actions/auth";

const useStyles = makeStyles((theme) => ({
    '@global'   : {
        ul: {
            margin   : 0,
            padding  : 0,
            listStyle: 'none',
        },
        a : {
            textDecoration: 'none'
        }
    },
    appBar      : {
        borderBottom: `1px solid ${theme.palette.divider}`,
        background  : "inherit"
    },
    toolbar     : {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
        color   : theme.palette.primary.main,
    },
    link        : {
        margin        : theme.spacing(1, 1.5),
        textTransform : "uppercase",
        color         : "inherit",
        textDecoration: "none",
        fontSize      : "small",
    },
    activeLink  : {
        color     : `${theme.palette.secondary.main} !important`,
        fontWeight: "600",
    },
    noPadding   : {
        paddingLeft : 0,
        paddingRight: 0
    },
    menu        : {
        "& li": {
            padding: theme.spacing(1, 2.5),
            display: "block"
        }
    }

}))


const Navbar = ({auth, logout}) => {
    const classes = useStyles();
    // const auth = useSelector(state => state.auth)
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <CssBaseline/>
            <AppBar
                position="sticky"
                color="transparent"
                elevation={1}
                className={classes.appBar}
            >
                <Container classes={{root: classes.noPadding}} maxWidth="xl">
                    <Toolbar className={classes.toolbar}>
                        <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                            <Link className={classes.toolbarTitle} to="/">blinkk.io</Link>
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
                        {auth.isAuthenticated &&
                        <Avatar style={{cursor: "pointer"}} alt={auth.user ? auth.user.username : ""} src="/broken-image.jpg"
                                color="secondary"
                                aria-controls="navbar-menu" aria-haspopup="true" onClick={auth.user && handleClick}/>

                        }
                        <Menu id="navbar-menu"
                              anchorEl={anchorEl}
                              keepMounted
                              open={Boolean(anchorEl)}
                              onClose={handleClose}
                              getContentAnchorEl={null}
                              anchorOrigin={{
                                  vertical  : 'bottom',
                                  horizontal: 'left',
                              }}
                              transformOrigin={{
                                  vertical  : 'top',
                                  horizontal: 'left',
                              }} classes={{paper: classes.menu}}>
                            {auth.isAuthenticated && <div>
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <Divider/>
                            <MenuItem onClick={handleClose}>My account</MenuItem>
                            <Divider/>
                            <MenuItem onClick={logout}>Logout</MenuItem></div>}
                        </Menu>
                    </Toolbar>
                </Container>
            </AppBar>
            {auth.isLoading || auth.isSubmitting ? <LinearProgress/> : <></>}
        </>
    );
}

const mapStateToProps = state => ({
    auth: state.auth
})
export default connect(mapStateToProps, {logout})(Navbar);
