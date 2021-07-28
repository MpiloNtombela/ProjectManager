import React, { memo, useState } from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";
import Task from "./Task";

const Tasks = ({ tasks, boardId }) => {
  return (
    <>
      {tasks.map((task, idx) => (
        <Task key={task.id} task={task} index={idx} />
      ))}
    </>
  );
};

Tasks.propTypes = {
  tasks: PropTypes.array.isRequired,
  boardId: PropTypes.string,
};

export default memo(Tasks);
