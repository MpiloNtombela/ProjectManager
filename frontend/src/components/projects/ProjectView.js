import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
// import Container from "@material-ui/core/Container";
// import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Stack from "@material-ui/core/Stack";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ProjectPageSkeleton from "../skeletons/projects/ProjectPageSkeleton";
import NewBoardForm from "../boards/NewBoardForm";
import Board from "../boards/Board";
import { DragDropContext } from "react-beautiful-dnd";
import { TASK_MOVED } from "../../actions/projectTypes";
import { useMutation } from "react-query";
import { moveTask } from "../../queries/tasks";
import createSnackAlert from "../../actions/snackAlerts";

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
  const { token } = useSelector((state) => state.auth);
  const boards = useSelector((state) => state.boardsState.boards);
  const dispatch = useDispatch();

  const moveAction = (moveData) => {
    const {
      taskId,
      sourceId,
      destinationId,
      sourceIdx,
      destinationIdx,
      error,
    } = moveData;
    const payload = {
      task: {
        id: taskId,
      },
      board: {
        source: { index: sourceIdx, id: sourceId },
        destination: { id: destinationId, index: destinationIdx },
      },
      error,
    };
    dispatch({
      type: TASK_MOVED,
      payload,
    });
  };

  const { mutate: move, isLoading: isMoving } = useMutation(moveTask, {
    onError: (error, variables) => {
      dispatch(createSnackAlert(error.response.data, error.response.status));
      // taking the original variable and reversing them, to reverse moving of task
      moveAction({
        taskId: variables.taskId,
        destinationIdx: variables.sourceIdx,
        sourceIdx: variables.destinationIdx,
        sourceId: variables.destination,
        destinationId: variables.source,
        error: true,
      });
    },
    retry: 0,
  });

  const handleMove = (results) => {
    const { draggableId, source, destination } = results;
    if (!destination || source.droppableId === destination.droppableId) return;
    move({
      token,
      taskId: draggableId,
      source: source.droppableId,
      destination: destination.droppableId,
      sourceIdx: source.index,
      destinationIdx: destination.index,
    });
    // required: {taskId, sourceId, destinationId, sourceIdx, destinationIdx}
    moveAction({
      taskId: draggableId,
      sourceId: source.droppableId,
      destinationId: destination.droppableId,
      sourceIdx: source.index,
      destinationIdx: destination.index,
    });
  };

  if (isLoading) return <ProjectPageSkeleton />;

  if (isError) return <Typography>Failed to load project</Typography>;

  return (
    <Stack direction={"row"} spacing={1} className={classes.stackRoot}>
      <DragDropContext onDragEnd={(results) => handleMove(results)}>
        {boards ? (
          <>
            {boards.map((board, idx) => (
              <Board isMoving={isMoving} key={board.id} board={board} idx={idx} />
            ))}
            <NewBoardForm />
          </>
        ) : (
          <Typography variant={"h2"} color={"error"}>
            Failed to load boards
          </Typography>
        )}
      </DragDropContext>
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
