import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useParams} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ProjectPageSkeleton from "../skeleton/projects/ProjectPageSkeleton";
import ProductPageBoardsSkeleton from "../skeleton/projects/ProductPageBoardsSkeleton";
import {getProject} from "../../actions/projects";
import Boards from "./boards/Boards";
import whyDidYouRender from "@welldone-software/why-did-you-render";

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: `linear-gradient(145deg, ${theme.palette.secondary.main} 30%, ${theme.palette.primary.main} 90%)`,
    overflowY: 'auto',
    minWidth: '100%',
    scrollbarWidth: 'tiny',
    '&::-webkit-scrollbar': {
      width: '.25rem'
    }
  },
  hideScroll: {
    overflow: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  speedDial: {
    position: 'fixed',
    bottom: theme.spacing(8),
    right: theme.spacing(2),
    '& button': {
      borderRadius: '50%',
      background: theme.palette.secondary.main
    }
  },
  projectContainer: {
    height: '100%'
  },
  projectBar: {
    position: 'sticky',
    left: 0,
    textTransform: 'capitalize'
  },
  projectBoardsGrid: {
    display: 'grid',
    gridAutoColumns: '270px',
    gridAutoFlow: 'column',
    '&:last-child': {
      paddingRight: '.75rem'
    }
  }
}))

whyDidYouRender(React, {
  onlyLogs: true,
  titleColor: 'green',
  diffNameColor: 'dodgerblue'
})

// Typography.whyDidYouRender = true

const ProjectPage = () => {
  const classes = useStyles()
  const projectState = useSelector(state => state.projectState)
  const dispatch = useDispatch()

  const {id} = useParams()

  useEffect(() => {
    dispatch(getProject(id))
  }, [dispatch, id])

  return (
    <>{projectState.isLoading ? <ProjectPageSkeleton/>
      : <>
        {projectState.project ?
          <>
            <Container className={`${classes.hideScroll} ${classes.projectContainer}`} maxWidth="xl">
              <div className={classes.projectBar}>
                <Typography color="textSecondary" component="h1" variant="h5">
                  {projectState.project.name}
                </Typography>
              </div>
              <Box sx={{py: 3}}>
                <Grid container className={classes.projectBoardsGrid} spacing={1}>
                  {projectState.boardsState.isBoardsLoading ? <ProductPageBoardsSkeleton/>
                    : projectState.boardsState.boards ? <Boards/>
                      : <Typography variant={'h1'} color={"error"}>Failed to load boards</Typography>
                  }
                </Grid>
              </Box>
            </Container>
          </>
          : <Typography variant='h1' component='h1' color='error'>Failed to load project</Typography>}
      </>
    }
    </>
  );
}

ProjectPage.propTypes = {
  token: PropTypes.string
};

export default ProjectPage;