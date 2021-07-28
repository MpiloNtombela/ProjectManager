import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import { addRemoveMember } from "../../actions/projects/tasks";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { Close, PersonAdd } from "@material-ui/icons";
import makeStyles from "@material-ui/core/styles/makeStyles";
import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import MembersForm from "./forms/MembersForm";

const useStyles = makeStyles({
  root: {
    margin: ".25rem",
    background: "transparent",
  },
  avatar: {
    height: "1.5rem",
    width: "1.5rem",
  },
  listAvatar: {
    minWidth: "0",
    marginRight: ".5rem",
  },
  secAction: {
    right: ".25rem",
  },
  iconSmall: {
    height: "1rem",
    width: "1rem",
  },
});

const TaskMembers = ({ boardId, id, members, isRequesting }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleRemoveMember = (userId) => {
    dispatch(addRemoveMember(boardId, id, userId, "remove"));
  };
  return (
    <>
      {members.length ? (
        <List dense>
          {members.map((member) => (
            <ListItem
              className={classes.root}
              component={Card}
              variant={"outlined"}
              key={member.id}>
              <ListItemAvatar className={classes.listAvatar}>
                <Avatar
                  className={classes.avatar}
                  alt={member.username}
                  src={member.avatar}
                />
              </ListItemAvatar>
              <ListItemText primary={member.username} />
              <ListItemSecondaryAction className={classes.secAction}>
                <IconButton
                  disabled={isRequesting}
                  onClick={() => {
                    handleRemoveMember(member.id);
                  }}
                  size={"small"}>
                  <Close className={classes.iconSmall} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      ) : null}
      <Button
        size="small"
        startIcon={<PersonAdd />}
        disableElevation
        fullWidth
        color="primary"
        onClick={handleOpen}>
        add members
      </Button>
      <MembersForm open={open} onClose={handleClose} />
    </>
  );
};

TaskMembers.propTypes = {
  boardId: PropTypes.string,
  id: PropTypes.string.isRequired,
  members: PropTypes.array.isRequired,
  isRequesting: PropTypes.bool,
};

export default memo(TaskMembers);
