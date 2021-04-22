import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Add from "@material-ui/icons/Add";
import axios from "axios";
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {useMutation, useQuery} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from 'react-router-dom'
import {PROJECTS_LOADED} from "../actions/projectTypes";
import createSnackAlert from "../actions/snackAlerts";
import createdInviteProject from "../selectors/createdInviteProject";
import {tokenConfig} from "./common/axiosConfig";
import ProjectCard from "./projects/ProjectCard";
import {CancelButton, SaveButton} from "./reuse/ReButtons";

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
    "&:hover": {
      boxShadow: `0 0 .50rem 0px ${theme.palette.primary.light}`,
      cursor: 'pointer'
    }
  },
  title: {
    fontWeight: 'bold',
    opacity: '.85'
  },
  dialog: {
    position: 'absolute',
    top: '1rem'
  },
  newProject: {
    background: 'transparent',
    borderStyle: 'dashed',
    borderWidth: '2px',
    height: '100%',
    
  },
  newProjectBtn: {
    padding: '1rem',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap'
  },
  
}));

const addProject = async (kwargs) => {
  const {name, token} = kwargs
  const body = await JSON.stringify({name})
  return await axios.post('/api/projects/req/projects/', body, tokenConfig(token))
}


const NewProjectForm = ({open, handleClose}) => {
  const [name, setName] = useState('')
  const {token} = useSelector(state => state['auth'])
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()
  const {mutate, isLoading} = useMutation(addProject, {
    onSuccess: ({data}) => history.push(`/project/${data.id}`),
    onError: ({response}) => dispatch(createSnackAlert(response.data, response.statusCode))
  })
  const handleChange = e => {
    setName(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const temp = name.trim()
    if (!temp || temp.length < 1) {
      return dispatch(createSnackAlert('project name is required!', 400))
    }
    mutate({name, token})
  }
  return (
    <Dialog fullWidth
            color={'primary'}
            classes={{paper: classes.dialog}}
            open={open} onClose={handleClose}
            aria-labelledby="title">
      {isLoading && <LinearProgress variant={'indeterminate'}/>}
      <DialogTitle id="title">Give the project a name</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            placeholder={'project name'}
            aria-label={'project name'}
            type="text"
            inputProps={{maxLength: 100}}
            fullWidth
            value={name}
            onChange={handleChange}
            variant={'standard'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button disabled={isLoading}>
            create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

NewProjectForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}

const getUserProjects = async (token) => {
  return await axios.get('/api/projects/req/projects/', tokenConfig(token))
}

const Home = () => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const {token} = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const projects = useSelector(state => createdInviteProject(state))
  
  const {isLoading, isError} = useQuery(
    ['user-projects', token], () => getUserProjects(token), {
      onSuccess: ({data}) => {
        return dispatch({
          type: PROJECTS_LOADED,
          payload: data
        })
      }
    }
  )
  if (isLoading) {
    return <h3>Loading...</h3>
  }
  if (isError) {
    return <h3>Error occurred</h3>
  }
  
  
  const handleOpenForm = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const {created, joined} = projects
  return (
    <Box component="main" sx={{my: 3}}>
      <Container maxWidth="md">
        <Typography variant="h6" component="h2">Your Projects</Typography>
        {created.length ? <Box sx={{my: 2}} display={'flex'} justifyContent={'flex-end'} width={'100%'}>
          <Button onClick={handleOpenForm} variant={'contained'} startIcon={<Add/>} size={'small'}>
            create project
          </Button>
        </Box> : ''}
        <Grid container spacing={1}>
          {created.length ? created.map((project) => (
              <Grid item key={project.id} xs={12} sm={6} md={4}>
                <ProjectCard project={project}/>
              </Grid>
            ))
            : <Grid item xs={12} sm={4}>
              <div>
                <Typography sx={{my: 2}} variant={'subtitle2'} component={'h5'}>You have no projects</Typography>
                <Card variant='outlined' className={classes.newProject}>
                  <CardActionArea className={classes.newProjectBtn} onClick={handleOpenForm}>
                    <Add color={'disabled'}/>
                    <Typography component='h2' color={'textSecondary'} variant="h5">
                      create new project
                    </Typography>
                  </CardActionArea>
                </Card>
              </div>
            </Grid>}
        </Grid>
        <Box sx={{my: 2}}><Typography variant="h6" component="h2">Joined Projects</Typography></Box>
        <Grid container spacing={1}>
          {joined.map((project) => (
            <Grid item key={project.id} xs={12} sm={6} md={4}>
              <ProjectCard project={project}/>
            </Grid>
          ))}
        </Grid>
      </Container>
      <NewProjectForm open={open} handleClose={handleClose}/>
    </Box>
  );
}

export default Home;