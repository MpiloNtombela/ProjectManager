import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from "@material-ui/core/Tooltip";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  feedList: {
    margin: 0
  },
})

const TaskFeeds = ({feeds}) => {
  const classes = useStyles()
  return (
    <List>
      {feeds.map(feed => (
        <Tooltip placement={"bottom"} key={feed.id} title={feed.timestamp}>
          <div>
            <ListItemText
              className={classes.feedList}
              primary={
                <Typography color={'textSecondary'} variant={'caption'}>
                  {feed.user.username}
                </Typography>
              }
              secondary={
                <Typography component='h6' color="textPrimary" variant={"body2"}>
                  {feed["feed"]}
                </Typography>
              }/>
            <Divider/>
          </div>
        </Tooltip>
      ))}
    </List>
  )
};

TaskFeeds.propTypes = {
  feeds: PropTypes.array
};


export default TaskFeeds;
