import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreRounded from "@material-ui/icons/ExpandMoreRounded";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import CardContent from "@material-ui/core/CardContent";
import Tasks from "../tasks/Tasks";
import Card from "@material-ui/core/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useDispatch, useSelector } from "react-redux";
import ActionDialog from "../../reuse/ReDialogs";
import { deleteBoard } from "../../../actions/projects/boards";
import boardTasks from "../../../selectors/boardTasks";
import { BoardNameEdit } from "./InlineEditable";

export const BOARD_WIDTH = "250px";

const useStyles = makeStyles((theme) => ({
  board: {
    minWidth: BOARD_WIDTH,
    maxWidth: BOARD_WIDTH,
    height: "fit-content",
  },
  cardPadding: {
    padding: ".55rem .45rem 0 .45rem",
  },

  title: {
    fontSize: "inherit",
  },

  menu: {
    "& li": {
      padding: theme.spacing(0.75, 2),
      display: "block",
    },
  },
  menuText: {
    fontSize: "small",
  },
}));

const Board = ({ board, idx }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const _boardTasks = useSelector((state) => boardTasks(state, board));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenEdit = () => {
    setAnchorEl(null);
    setOpenEdit(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    setAnchorEl(null);
    dispatch(deleteBoard(board.id, idx));
  };

  const handleDeleteWarning = () => {
    setAnchorEl(null);
    setOpen(true);
  };

  const handleCancel = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  return (
    <>
      <Card className={classes.board}>
        <CardHeader
          classes={{ root: classes.cardPadding, title: classes.title }}
          title={
            <BoardNameEdit
              id={board.id}
              name={board.name}
              openEdit={openEdit}
              setOpenEdit={setOpenEdit}
            />
          }
          action={
            <IconButton
              size="small"
              aria-label="board controls"
              onClick={handleClick}>
              <ExpandMoreRounded />
            </IconButton>
          }
        />
        <Menu
          id="navbar-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          elevation={2}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          classes={{ paper: classes.menu }}>
          <MenuItem className={classes.menuText} onClick={handleOpenEdit}>
            Edit
          </MenuItem>
          <MenuItem
            className={classes.menuText}
            color={"error"}
            onClick={handleDeleteWarning}>
            Remove
          </MenuItem>
        </Menu>
        <CardContent classes={{ root: classes.cardPadding }}>
          {_boardTasks && <Tasks tasks={_boardTasks} boardId={board.id} />}
        </CardContent>
      </Card>
      <ActionDialog
        content={
          <Typography variant={"subtitle1"} component={"header"}>
            Remove <strong>{board.name}</strong> and all its tasks
          </Typography>
        }
        onCancelClick={handleCancel}
        onActionClick={handleDelete}
        actionText={"yes remove"}
        open={open}
      />
    </>
  );
};

Board.propTypes = {
  board: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
};

export default memo(Board);
