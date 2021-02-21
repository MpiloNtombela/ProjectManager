import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import React, {Suspense, useEffect} from "react";
import ProjectPageSkeleton from "../skeletons/projects/ProjectPageSkeleton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {getProject} from "../../actions/projects/projects";


const ProjectView = React.lazy(()=> import('./ProjectView'))

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
  const dispatch = useDispatch()

  const {id} = useParams()

  useEffect(() => {
    dispatch(getProject(id))
  }, [])

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