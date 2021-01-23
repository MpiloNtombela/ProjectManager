import PropTypes from "prop-types";
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (auth.userLoading) {
        console.log();
        return <h2>loading...</h2>;
      } else if (!auth.isAuthenticated) {
        return <Redirect to="/login" />;
      } else {
        return <Component {...props} />;
      }
    }}
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    userLoading: PropTypes.bool,
  }),
  component: PropTypes.any,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(PrivateRoute);
