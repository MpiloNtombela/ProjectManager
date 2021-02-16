import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import React, {Suspense} from "react";
import ProjectView from "./ProjectView";
import ProjectPageSkeleton from "../skeleton/projects/ProjectPageSkeleton";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    // background: `linear-gradient(145deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 90%)`,
    background: theme.palette.mode === 'light' ? '#eee' : theme.palette.background.default,
    overflowY: 'auto',
    minWidth: '100%',
    paddingTop: '5rem',
    scrollbarWidth: 'tiny',
    '&::-webkit-scrollbar': {
      width: '.25rem'
    }
  },
  container: {
    height: '100%',
    padding: 0
  }
}))

const ProjectTemplate = () => {
  const classes = useStyles()
  return (
    <Paper square elevation={0} className={classes.root}>
      <Container maxWidth='xl' className={classes.container}>
        <Suspense fallback={<ProjectPageSkeleton/>}>
          <ProjectView/>
        </Suspense>
      </Container>
    </Paper>
  );
}

export default ProjectTemplate;