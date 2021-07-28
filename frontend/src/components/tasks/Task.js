import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import { useDispatch } from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TaskView from "./TaskView";
import { getTask } from "../../actions/projects/tasks";
import AvatarGroup from "@material-ui/core/AvatarGroup";
import Avatar from "@material-ui/core/Avatar";
import { Draggable } from "react-beautiful-dnd";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "0 0 .25rem rgba(0, 0, 0, .25)",
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(0.75, 0),
    userSelect: "none",
    // background: theme.palette.background.paper
  },
  taskDrag: {
    border: `2px solid ${theme.palette.secondary.light}`,
    background: theme.palette.secondary.light,
    opacity: ".95",
  },
  actionArea: {
    padding: ".25rem",
    "& :hover": {
      cursor: (permissions) => (permissions.update ? "grab" : "inherit"),
    },
  },
  avatar: {
    width: "1.25rem",
    height: "1.25rem",
    fontSize: "small",
  },
}));

const Task = ({ task, index }) => {
  const classes = useStyles(task.permissions);
  const dispatch = useDispatch();
  const [openTask, setOpenTask] = useState(false);
  const handleTaskCardClick = () => {
    dispatch(getTask(task.id));
    setOpenTask(true);
  };

  return (
    <>
      <Draggable
        draggableId={task.id}
        index={index}
        isDragDisabled={!task.permissions.update}>
        {(provided, snapshot) => (
          <Card
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={`${classes.root} ${
              snapshot.isDragging ? classes.taskDrag : ""
            }`}
            onClick={handleTaskCardClick}>
            <CardActionArea className={classes.actionArea} component="div">
              <CardHeader
                sx={{ p: 0 }}
                title={
                  <Typography variant={"subtitle2"}>{task.name}</Typography>
                }
              />
              <Grid
                container
                justifyContent={"flex-end"}
                alignItems="center"
                spacing={1}
                style={{ width: "100%", margin: 0 }}>
                <AvatarGroup max={3} classes={{ avatar: classes.avatar }}>
                  {task["members"].map((member) => (
                    <Avatar
                      key={member.id}
                      className={classes.avatar}
                      alt={member.username}
                      src={member.avatar}
                    />
                  ))}
                </AvatarGroup>
              </Grid>
            </CardActionArea>
          </Card>
        )}
      </Draggable>
      <TaskView setOpenTask={setOpenTask} openTask={openTask} />
    </>
  );
};

Task.propTypes = {
  task: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default memo(Task);
