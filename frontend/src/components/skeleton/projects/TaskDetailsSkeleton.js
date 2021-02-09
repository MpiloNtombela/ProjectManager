import React, {memo} from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Card from "@material-ui/core/Card";
import ListItemText from "@material-ui/core/ListItemText";
import Skeleton from "@material-ui/core/Skeleton";
import PropTypes from "prop-types";


const skeletonNum = [1, 2, 3, 4]
const TaskDetailsSkeleton = ({classes}) => {
  return (
    <>
      <Skeleton animation="wave" variant="circular" width={30} height={30}
                style={{position: "absolute", top: '1.25rem', right: '1.25rem'}}/>
      {/*title*/}
      <DialogTitle id="task-details">
        <Skeleton animation="wave" variant='text' width='45%' height='20'/></DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8} md={9}>
            <Typography variant='subtitle1'><Skeleton animation="wave" variant="text" width='50%'/></Typography>
            {/*members*/}
            <div className={classes.flexAvatar}>
              {skeletonNum.map(x => <Skeleton animation="wave" variant='circular' key={x}><Avatar/></Skeleton>)}
            </div>
            <Box sx={{my: 3}}>
              <Typography><Skeleton animation="wave" variant='text' width='50%'/></Typography>
              <Box sx={{my: 2}}>
                <Skeleton animation="wave" variant='text' width="100%"/>
              </Box>
              {skeletonNum.map(x => (
                <Box key={x} sx={{my: 2}}>
                  <Skeleton animation="wave" variant='text' width='50%'/>
                </Box>
              ))}
            </Box>
            <Divider/>
            <Box sx={{my: 1}}>
              <Typography variant='h5'><Skeleton animation="wave" variant='text' width="60%"/></Typography>
              <Box sx={{my: 2}}>
                <form style={{display: 'flex'}} onSubmit={e => e.preventDefault()}>
                  <div style={{width: '90%'}}>
                    <Skeleton animation="wave" variant='text'/>
                  </div>
                  <div style={{width: '10%'}}>
                    <Skeleton animation="wave" variant='circular' width={35} height={35}/>
                  </div>
                </form>
              </Box>
              <List className={classes.root}>
                {/*comments*/}
                {skeletonNum.map(x => (
                  <Box key={x} sx={{my: 2}}>
                    <ListItem alignItems="flex-start" component={Card}>
                      <Skeleton animation="wave" variant='circular'><Avatar/></Skeleton>
                      <ListItemText
                        primary={
                          <Typography variant='subtitle2'>
                            <Skeleton animation="wave" variant='text' width='35%'/>
                          </Typography>}
                        secondary={
                          <>
                            <Skeleton animation="wave" variant='text' width='100%' height={15}/>
                            <Skeleton animation="wave" variant='text' width='100%' height={15}/>
                            <Skeleton animation="wave" variant='text' width='60%' height={15}/>
                          </>
                        }
                      />
                    </ListItem>
                  </Box>))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            {/*action area*/}
            <Typography variant='h5'><Skeleton animation="wave" variant='text' width="60%"/></Typography>
            {skeletonNum.map(x =>
              <Box key={x} sx={{my: 1}}>
                <Skeleton animation="wave" variant='rectangular' width="70%" height={20}/>
              </Box>)}
            <Box sx={{mb: 3}}/>
            {/*task feed*/}
            <Typography variant='h5'><Skeleton animation="wave" variant='text' width="60%"/></Typography>
            <List>
              {skeletonNum.map(x => (
                <div key={x}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2">
                        <Skeleton animation="wave" variant='text' width='35%'/>
                      </Typography>}
                    secondary={
                      <>
                        <Skeleton animation="wave" variant='text' width='100%' height={10}/>
                        <Skeleton animation="wave" variant='text' width='100%' height={10}/>
                        <Skeleton animation="wave" variant='text' width='50%' height={10}/>
                      </>}
                  />
                  <Divider/>
                </div>
              ))}
            </List>
          </Grid>
        </Grid>
      </DialogContent>
    </>
  );
};

TaskDetailsSkeleton.propTypes = {
  classes:  PropTypes.object
};


export default memo(TaskDetailsSkeleton);