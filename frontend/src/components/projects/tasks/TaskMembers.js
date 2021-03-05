import React, {memo} from 'react';
import PropTypes from 'prop-types'
import {useDispatch} from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import {addRemoveMember} from "../../../actions/projects/tasks";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import {Close} from "@material-ui/icons";
import makeStyles from "@material-ui/core/styles/makeStyles";
import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    margin: '.25rem',
    background: 'transparent'
  },
  avatar: {
    height: "1.5rem",
    width: "1.5rem"
  },
  listAvatar: {
    minWidth: '0',
    marginRight: '.5rem'
  },
  secAction: {
    right: '.25rem'
  },
  iconSmall: {
    height: '1rem',
    width: '1rem'
  },
})


const TaskMembers = ({id, members, isRequesting}) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const handleRemoveMember = userId => {
    dispatch(addRemoveMember(id, userId, 'remove'))
  }
  return (
    <>
      {members.length ?
      <List dense>
        {members.map(member => (
          <ListItem className={classes.root} component={Card} variant={'outlined'} key={member.id}>
            <ListItemAvatar className={classes.listAvatar}>
              <Avatar
                className={classes.avatar}
                alt={member.username}
                src={member.avatar}
              />
            </ListItemAvatar>
            <ListItemText primary={member.username}/>
            <ListItemSecondaryAction className={classes.secAction}>
              <IconButton disabled={isRequesting}
                          onClick={() => {
                            handleRemoveMember(member.id)
                          }} size={'small'}>
                <Close className={classes.iconSmall}/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>: <Typography color={"textSecondary"} variant={'caption'}>No members yet...</Typography>}
    </>
  );
};

TaskMembers.propTypes = {
  id: PropTypes.string.isRequired,
  members: PropTypes.array.isRequired,
  isRequesting: PropTypes.bool
};

export default memo(TaskMembers);