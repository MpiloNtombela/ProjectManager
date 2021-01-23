import PropTypes from "prop-types";
import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import Slide from "@material-ui/core/Slide";
import Divider from "@material-ui/core/Divider";

function BoardCard({ name, tasks, visibility }) {
  const date = new Date();
  return (
    <Card>
      <CardHeader title={name} />
      {visibility && (
        <CardContent>
          {tasks && (
            <Slide direction="left" in={visibility} mountOnEnter unmountOnExit>
              <List>
                {Object.keys(tasks).map((task, idx) => {
                  return (
                    <div key={idx}>
                      <Divider />
                      <ListItem style={{ padding: 0 }}>
                        <ListItemAvatar>
                          <Avatar>
                            <ImageIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={tasks[task]}
                          secondary={date.toDateString()}
                        />
                      </ListItem>
                    </div>
                  );
                })}
                <Divider />
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
  visibility: PropTypes.bool
}

export default BoardCard;
