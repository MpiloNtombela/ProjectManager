import React, {memo, useState} from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import TaskCard from "../tasks/TaskCard";
import Grid from "@material-ui/core/Grid";
import NewBoardForm from "./NewBoardForm";
import CardActionArea from "@material-ui/core/CardActionArea";
import Add from "@material-ui/icons/Add";
import {useDispatch, useSelector} from "react-redux";
import Skeleton from "@material-ui/core/Skeleton";
import IconButton from "@material-ui/core/IconButton";
import {MoreVert} from "@material-ui/icons";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import {deleteBoard} from "../../../actions/projects";

const useStyles = makeStyles((theme) => ({
  cardPadding: {
    padding: '.55rem'
  },

  assignedAvatar: {
    height: '1rem',
    width: '1rem'
  },

  title: {
    fontWeight: "700"
  },
  menu: {
    "& li": {
      padding: theme.spacing(.75, 2),
      display: "block"
    }
  },
  menuText: {
    fontSize: 'small'
  }
}));

// eslint-disable-next-line no-unused-vars
const BoardCard = () => {
  const classes = useStyles();
  const [newBoard, setNewBoard] = useState(false);
  const boards = useSelector(state => state.projectState.boardsState.boards)
  const isCreating = useSelector(state => state.projectState.boardsState.isCreating)
  const dispatch = useDispatch()

  const handleClickCreateNewBoard = () => {
    setNewBoard(true);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteWarning = (id, index)=>{
    setAnchorEl(null);
    dispatch(deleteBoard(id, index))
  }


  return (
    <>
      {boards.map((board, idx) => (
        <Grid item key={board.id} xs={4} style={{maxWidth: '270px'}}>
          <Card>
            <CardHeader classes={{root: classes.cardPadding}}
                        title={<Typography className={classes.title} variant='title'>{board.name}</Typography>}
                        action={
                          <IconButton aria-label="settings">
                            <MoreVert/>
                          </IconButton>}
                        onClick={handleClick}/>
            <Menu id="navbar-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  getContentAnchorEl={null}
                  elevation={2}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }} classes={{paper: classes.menu}}>
              <MenuItem className={classes.menuText}  color={'error'}
                        onClick={()=>{handleDeleteWarning(board.id, idx)}}>Delete</MenuItem>
            </Menu>
            <CardContent classes={{root: classes.cardPadding}}>
              {board['board_tasks'] && <TaskCard tasks={board['board_tasks']}/>}
            </CardContent>
          </Card>
        </Grid>
      ))}
      {isCreating && !newBoard &&
      <Grid item xs={4} style={{maxWidth: '270px'}}>
        <Card>
          <CardHeader classes={{root: classes.cardPadding}} title={<Skeleton animation="wave" variant='text'/>}/>
          <CardContent classes={{root: classes.cardPadding}}>
            <Typography variant={'h3'}><Skeleton animation={'wave'} variant={'text'}/></Typography>
          </CardContent>
        </Card>
      </Grid>
      }
      <Grid item xs={4} style={{maxWidth: '250px'}}>
        {newBoard ? <NewBoardForm setNewBoard={setNewBoard}/>
          : <Card variant='outlined' style={{background: 'transparent'}}>
            <CardActionArea disabled={isCreating} style={{padding: "1rem"}} onClick={handleClickCreateNewBoard}>
              <Add/> <Typography component='span' variant="h6">create new board</Typography>
            </CardActionArea>
          </Card>
        }
      </Grid>
    </>
  );
};

export default memo(BoardCard);
