import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from "@material-ui/core/Tooltip";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  logList: {
    margin: 0
  },
})

const TaskLogs = ({logs}) => {
  const classes = useStyles()
  return (
    <List>
      {logs.map(log => (
        <Tooltip placement={"bottom"} key={log.id} title={log.timestamp}>
          <div>
            <ListItemText
              className={classes.logList}
              primary={
                <Typography color={'textSecondary'} variant={'caption'}>
                  {log.user.username}
                </Typography>
              }
              secondary={
                <Typography component='h6' color="textPrimary" variant={"body2"}>
                  {log["log"]}
                </Typography>
              }/>
            <Divider/>
          </div>
        </Tooltip>
      ))}
    </List>
  )
};

TaskLogs.propTypes = {
  logs: PropTypes.array
};


export default TaskLogs;
