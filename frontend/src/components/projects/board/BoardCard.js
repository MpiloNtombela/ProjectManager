import PropTypes from "prop-types";
import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Slide from "@material-ui/core/Slide";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "0 0 5px rgba(0, 0, 0, .2)",
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(1, 0),
  },

  title: {
    fontWeight: "700",
  },
}));

function BoardCard({ name, tasks, visibility }) {
  const date = new Date();
  const classes = useStyles();
  return (
    <Card elecation={4}>
      <CardHeader title={name} />
      {visibility && (
        <CardContent>
          {tasks && (
            <Slide direction="left" in={visibility} mountOnEnter unmountOnExit>
              <List>
                {Object.keys(tasks).map((task, idx) => {
                  return (
                    <ListItem key={idx} className={classes.root}>
                      <ListItemText
                        primary={tasks[task]}
                        secondary={date.toDateString()}
                        classes={{
                          root: classes.title,
                        }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Slide>
          )}
        </CardContent>
      )}
    </Card>
  );
}

BoardCard.propTypes = {
  name: PropTypes.string,
  tasks: PropTypes.any,
  visibility: PropTypes.bool,
};

export default BoardCard;
