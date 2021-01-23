import PropTypes from "prop-types";
import React from "react";
import {Redirect, Route} from "react-router-dom";
import {connect} from "react-redux";

const AnonRoute = ({component: Component, auth, ...rest}) => (
    <Route
        {...rest}
        render={(props) => {
            if (auth.isLoading) {
                return <h2>Loading...</h2>;
            } else if (auth.isAuthenticated) {
                return <Redirect to="/"/>;
            } else {
                return <Component {...props} />;
            }
        }}
    />
);

AnonRoute.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    isLoading: PropTypes.bool
  }),
  component: PropTypes.any
}

const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps)(AnonRoute);