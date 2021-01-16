import * as React from 'react';
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import makeStyles from "@material-ui/core/styles/makeStyles";
import HomeIcon from '@material-ui/icons/HomeRounded';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Paper from "@material-ui/core/Paper";
import {NavLink} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root      : {
        width: "100%",
    },
    bottomNav : {
        position: 'fixed',
        bottom  : 0,
        left    : 0,
        right   : 0,
    },
    activeLink: {
        color     : theme.palette.secondary.main,
        fontWeight: "600",
    },
}));

const BottomNavbar = () => {
    const classes = useStyles();
    // const [value, setValue] = React.useState(0);
    return (
        <Paper elevation={3} className={classes.bottomNav}>
            <BottomNavigation showLabels className={classes.root}>
                <BottomNavigationAction activeClassName={classes.activeLink} component={NavLink} to="/" label="Home"
                                        icon={<HomeIcon/>}/>
                <BottomNavigationAction activeClassName={classes.activeLink} component={NavLink} to="/profile" label="Profile"
                                        icon={<FavoriteIcon/>}/>
                <BottomNavigationAction activeClassName={classes.activeLink} component={NavLink} to="#" label="Nearby"
                                        icon={<LocationOnIcon/>}/>
            </BottomNavigation>
        </Paper>
    );
};

export default BottomNavbar;