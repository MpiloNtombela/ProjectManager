import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
// import Container from "@material-ui/core/Container";
// import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Stack from "@material-ui/core/Stack";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ProjectPageSkeleton from "../skeletons/projects/ProjectPageSkeleton";
import Boards from "./boards/Boards";
// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
// import Button from "@material-ui/core/Button";
// import PersonAdd from "@material-ui/icons/PersonAdd";
// import InvitationPopper from "./projectActions/InvitationAction";
// import Tabs from "@material-ui/core/Tabs";
// import Tab from "@material-ui/core/Tab";

const useStyles = makeStyles((theme) => ({
  stackRoot: {
    padding: theme.spacing(0, 2, 2, 2),
    overflowY: "auto",
    minHeight: "100%",
    scrollbarWidth: "tiny",
    "&::-webkit-scrollbar": {
      width: ".50rem",
      height: ".1rem",
    },
    "&::-webkit-scrollbar-thumb": {
      background: theme.palette.secondary.light,
    },
    "&::-webkit-scrollbar:hover": {
      height: ".5rem",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: theme.palette.secondary.dark,
    },
  },
}));

const ProjectView = ({ isLoading, isError }) => {
  const classes = useStyles();
  const boardsState = useSelector((state) => state.boardsState);

  // const [value, setValue] = useState(2);

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };

  if (isLoading) return <ProjectPageSkeleton />;

  if (isError) return <Typography>Failed to load project</Typography>;

  return (
    <Stack direction={"row"} spacing={1} className={classes.stackRoot}>
      {boardsState.boards ? (
        <Boards />
      ) : (
        <Typography variant={"h2"} color={"error"}>
          Failed to load boards
        </Typography>
      )}
    </Stack>
  );
};

// ProjectBar.propTypes = {
//   id: PropTypes.string.isRequired,
//   title: PropTypes.string.isRequired,
// };

ProjectView.propTypes = {
  token: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
};

export default ProjectView;
