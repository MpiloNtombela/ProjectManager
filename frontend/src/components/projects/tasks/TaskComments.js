import React, {memo} from 'react';
import PropTypes from 'prop-types';
import ListItem from "@material-ui/core/ListItem";
import Card from "@material-ui/core/Card";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
// import whyDidYouRender from "@welldone-software/why-did-you-render";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import {Delete} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import {deleteComment} from "../../../actions/projects/tasks";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles({
  commentItem: {
    paddingTop: 0,
    paddingBottom: 0
  },
  commenterAvatar: {
    height: '2rem',
    width: '2rem'
  },
  commentInfo: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
})

/*// whyDidYouRender(React, {
//   onlyLogs: true,
//   titleColor: 'green',
//   diffNameColor: 'dodgerblue'
// })
//
// List.whyDidYouRender = true*/

const TaskComments = ({comments}) => {
  const classes = useStyles();
  const dispatch = useDispatch()
  return (
    <List>
      {comments.map(comment => (
        <Box key={comment.id} sx={{my: .75}}>
          <ListItem variant='outlined' alignItems="flex-start" className={classes.commentItem} component={Card}>
            <ListItemAvatar>
              <Avatar className={classes.commenterAvatar} alt={comment["commenter"].username}
                      src={comment["commenter"].avatar}/>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Tooltip title={comment.timestamp} arrow>
                  <Typography color={'textSecondary'} variant={'caption'} component={'p'}
                              className={classes.commentInfo}>
                    {comment["commenter"].username} -
                    <Typography component={'span'} variant={'caption'}> {comment.timestamp}</Typography>
                  </Typography>
                </Tooltip>}
              secondary={<Typography color={'textPrimary'} variant={'body2'}>{comment.comment}</Typography>}
            />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => {
                  dispatch(deleteComment(comment.id))
                }}
                size={'small'}
                edge="end"
                aria-label="delete comment">
                <Delete/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </Box>
      ))}
    </List>
  );
};

TaskComments.propTypes = {
  comments: PropTypes.array.isRequired
};

export default memo(TaskComments);