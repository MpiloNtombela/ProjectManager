import React, { memo } from "react";
import NewBoardForm from "./NewBoardForm";
import { useSelector } from "react-redux";
import Board from "./Board";
import Box from "@material-ui/core/Box";

const Boards = () => {
  const boards = useSelector((state) => state.boardsState.boards);

  return (
    <>
      {boards.map((board, idx) => (
        <Board key={board.id} board={board} idx={idx} />
      ))}
      <NewBoardForm />
    </>
  );
};

export default memo(Boards);
