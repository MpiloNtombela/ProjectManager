import React, {useState} from 'react';
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import LoginUsername from "./LoginUsername";
import LoginEmail from "./LoginEmail";
import {connect} from "react-redux";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {Redirect} from 'react-router-dom'
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textItems: 'center',
    paddingBottom: theme.spacing(10)
  },
  centered: {
    display: "block",
    textAlign: "center"
  },
}))


const Login = ({auth}) => {
    const isAuthenticated = auth.isAuthenticated;
    const isLoading = auth.isLoading;
    const isSubmitting = auth.isSubmitting;
    const classes = useStyles();
    const [selectedTab, setSelectedTab] = useState(0);

    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const a11yProps = index => {
        return {
            id             : `login-tab-${index}`,
            'aria-controls': `login-with-${index}-tab`,
        };
    }

    if (isAuthenticated) {
        return <Redirect to="/"/>;
    } else {
        return (
            <Container component="main" maxWidth="xs" className={classes.paper}>
                <CssBaseline/>
                <Card>
                    <CardContent>
                        <Typography className={classes.centered} component="h1" variant="h5">
                            Log in
                        </Typography>
                        <Tabs centered value={selectedTab} onChange={handleChange} aria-label="log in tabs">
                            <Tab label="username" {...a11yProps('username')} disabled={isLoading || isSubmitting}/>
                            <Tab label="email" {...a11yProps('email')} disabled={isLoading || isSubmitting}/>
                        </Tabs>
                        {
                            selectedTab === 0 ? <LoginUsername/> : <LoginEmail/>
                        }
                    </CardContent>
                </Card>
            </Container>
        );
    }
}
const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(Login)