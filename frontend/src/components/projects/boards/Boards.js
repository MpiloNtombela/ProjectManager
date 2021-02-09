import React, {memo, useState} from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import NewBoardForm from "./NewBoardForm";
import CardActionArea from "@material-ui/core/CardActionArea";
import {useSelector} from "react-redux";
import Skeleton from "@material-ui/core/Skeleton";
import Board from "./Board";
import Add from '@material-ui/icons/Add'

const useStyles = makeStyles(() => ({
  cardPadding: {
    padding: '.55rem'
  },
  createBoard: {
    background: 'transparent',
    borderStyle: 'dashed',
    borderWidth: '2px'

  },
  createBoardBtn: {
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap'
  },

  boardGrid: {
    maxWidth: '270px'
  }
}));


const Boards = () => {
  const classes = useStyles();
  const [newBoard, setNewBoard] = useState(false);
  const boards = useSelector(state => state.projectState.boardsState.boards)
  const isCreating = useSelector(state => state.projectState.boardsState.isCreating)

  const handleClickCreateNewBoard = () => {
    setNewBoard(true);
  };


  return (
    <>
      {boards.map((board, idx) => (
        <Grid item key={board.id} xs={4} className={classes.boardGrid}>
          <Board board={board} idx={idx}/>
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
      <Grid item xs={4} className={classes.boardGrid}>
        {newBoard ? <NewBoardForm setNewBoard={setNewBoard}/>
          : <Card variant='outlined' className={classes.createBoard}>
            <CardActionArea
              className={classes.createBoardBtn}
              disabled={isCreating}
              onClick={handleClickCreateNewBoard}>
              <Add/> <Typography component='h2' variant="h6"> create new board</Typography>
            </CardActionArea>
          </Card>
        }
      </Grid>
      <Grid item xs={1}/>
    </>
  );
};

export default memo(Boards);
