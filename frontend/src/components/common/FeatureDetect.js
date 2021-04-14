import React from "react";
import PropTypes from "prop-types";

const FeatureDetect = ({ feature, children }) => {
  return <>{feature && children}</>;
};

FeatureDetect.propTypes = {
  feature: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
};

export default FeatureDetect;
