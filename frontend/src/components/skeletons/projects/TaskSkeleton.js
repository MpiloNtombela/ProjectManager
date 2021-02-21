import React from 'react';
import PropTypes from 'prop-types';
import CardHeader from "@material-ui/core/CardHeader";
import CardActionArea from "@material-ui/core/CardActionArea";
import Card from "@material-ui/core/Card";
import Skeleton from "@material-ui/core/Skeleton";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  root: {
    boxShadow: "0 0 5px rgba(0, 0, 0, .3)",
    margin: '.25rem 0'
  },
  cardPadding: {
    padding: '.55rem'
  }
})

const TaskSkeleton = ({num}) => {
  const classes = useStyles();
  return (
    <>
      {num.map(x => (
        <div key={x} style={{margin: '.5rem 0px'}}>
          <Card className={classes.root}>
            <CardActionArea style={{display: 'block'}} component='div'>
              <CardHeader className={classes.cardPadding}
                          title={<Skeleton animation="wave" variant='text' height={20} width={'95%'}/>}
              />
              <Grid container justifyContent={"flex-end"} alignItems="center" spacing={2}
                    style={{width: '100%', margin: 0, padding: '.25rem .55rem'}}>
                {[1, 2, 3].map(x => (
                  <Grid item key={x} style={{paddingTop: 0}}>
                    <Skeleton animation="wave" variant="circular" width={15} height={15}/>
                  </Grid>
                ))}
              </Grid>
            </CardActionArea>
          </Card>
        </div>
      ))}
    </>)
}

TaskSkeleton.propTypes = {
  num: PropTypes.array.isRequired
}

export default TaskSkeleton;