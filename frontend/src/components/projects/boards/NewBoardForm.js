import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import { CancelButton, SaveButton } from "../../reuse/ReButtons";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import createSnackAlert from "../../../actions/snackAlerts";
import { tokenConfig } from "../../common/axiosConfig";
import axios from "axios";
import { useMutation } from "react-query";
import { BOARD_CREATED } from "../../../actions/projectTypes";
import CardContent from "@material-ui/core/CardContent";
import BarLoader from "../../layout/BarLoader";
import { BOARD_WIDTH } from "./Board";
import { Add } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import CardActionArea from "@material-ui/core/CardActionArea";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles( theme => ({
  root: {
    padding: ".50rem",
  },
  form: {
    marginTop: "1rem",
  },
  flexButtons: {
    display: "flex",
    justifyContent: "flex-end",
    "& > *": {
      margin: ".50rem .25rem",
    },
    "& button": {
      height: "2rem",
      width: "2rem",
    },
  },
  cardPadding: {
    padding: ".55rem",
  },
  createBoard: {
    background: "transparent",
    borderStyle: "dashed",
    borderWidth: "2px",
  },
  createBoardBtn: {
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
  },

  board: {
    minWidth: BOARD_WIDTH,
    maxWidth: BOARD_WIDTH,
    // marginRight: theme.spacing(2)
  },
  boardLoader: {
    width: BOARD_WIDTH,
    height: "100px",
    position: "relative",
  },
}));

const createNewBoard = async (data) => {
  const { name, id, token } = data;
  const body = JSON.stringify({ name, project: id });
  return await axios.post(
    `/api/projects/req/project/${id}/boards/`,
    body,
    tokenConfig(token)
  );
};
const CreateBoardButton = ({ isLoading, handleOpenForm }) => {
  const classes = useStyles();
  return (
    <Card variant="outlined" className={classes.createBoard}>
      <CardActionArea
        className={classes.createBoardBtn}
        disabled={isLoading}
        onClick={handleOpenForm}>
        <Add />{" "}
        <Typography component="h2" variant="h6">
          create new board
        </Typography>
      </CardActionArea>
    </Card>
  );
};
const NewBoardForm = () => {
  const classes = useStyles();
  const [openForm, setOpenForm] = useState(false);
  const [boardName, setBoardName] = useState("");
  const dispatch = useDispatch();
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);

  const handleFormReset = () => {
    setBoardName("");
    setOpenForm(false);
  };
  const handleChange = (e) => {
    setBoardName(e.target.value);
  };

  const { mutate: createBoard, isLoading, isError, error } = useMutation(
    createNewBoard,
    {
      onSuccess: ({ data }) => {
        dispatch({
          type: BOARD_CREATED,
          payload: data,
        });
      },
      onError: ({ data: { response } }) => {
        console.log(response);
        dispatch(createSnackAlert(response.data, response.status));
      },
      onSettled: () => {
        handleFormReset();
      },
    }
  );

  if (isError) console.log("mpilo", error);

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = boardName.trim();
    if (name) {
      createBoard({ name, id, token });
    } else {
      dispatch(createSnackAlert("board name is required", 400));
    }
  };
  if (isLoading) {
    return (
      <div className={classes.board}>
        <Card className={classes.boardLoader}>
          <CardContent classes={{ root: classes.cardPadding }}>
            <BarLoader />
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <>
      <div className={classes.board}>
        {openForm ? (
          <Card classes={{ root: classes.root }}>
            <form className={classes.form} onSubmit={handleSubmit}>
              <TextField
                fullWidth
                variant="standard"
                autoFocus
                required
                value={boardName}
                onChange={handleChange}
                placeholder="board name"
                size="small"
                aria-label="name of new board"
                name="boardName"
              />
              <div className={classes.flexButtons}>
                <CancelButton type={"button"} onClick={handleFormReset} />
                <SaveButton type={"submit"} />
              </div>
            </form>
          </Card>
        ) : (
          <CreateBoardButton
            isLoading={isLoading}
            handleOpenForm={handleOpenForm}
          />
        )}
      </div>
      <Box sx={{pr: 1}}/>
    </>
  );
};

CreateBoardButton.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  handleOpenForm: PropTypes.func.isRequired,
};

export default memo(NewBoardForm);
