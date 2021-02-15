import React from 'react';
import PropTypes from 'prop-types';
import ListItem from "@material-ui/core/ListItem";
import Card from "@material-ui/core/Card";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import whyDidYouRender from "@welldone-software/why-did-you-render";


whyDidYouRender(React, {
  onlyLogs: true,
  titleColor: 'green',
  diffNameColor: 'dodgerblue'
})

List.whyDidYouRender = true

const TaskComments = ({comments}) => {
  return (
    <List>
      {comments.map(comment => (
        <Box key={comment.id} sx={{my: 2}}>
          <ListItem variant='outlined' alignItems="flex-start" component={Card}>
            <ListItemAvatar>
              <Avatar alt={comment["commenter"].username} src={comment["commenter"].avatar}/>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography color={'textSecondary'} variant={'caption'}>
                  {comment["commenter"].username} -
                  <Typography component={'span'} variant={'caption'}> {comment.timestamp}</Typography>
                </Typography>}
              secondary={<Typography color={'textPrimary'} variant={'body2'}>{comment.comment}</Typography>}
            />
          </ListItem>
        </Box>
      ))}
    </List>
  );
};

TaskComments.propTypes = {
  comments: PropTypes.array.isRequired
};

export default TaskComments;