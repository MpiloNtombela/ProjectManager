import React from 'react';
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Skeleton from "@material-ui/core/Skeleton";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TaskSkeleton from "./TaskSkeleton";

const useStyles = makeStyles({
  cardPadding: {
    padding: '.55rem'
  }
})

const skeletonNum = [1, 2, 3, 4]
const ProductPageBoardsSkeleton = () => {
  // TODO: add padding to skeleton
  const classes = useStyles()
  return (
    <>
      {skeletonNum.map(bx => (
        <Grid item key={bx} xs={4} style={{maxWidth: '270px'}}>
          <Card>
            <CardHeader className={classes.cardPadding}
                        title={<Skeleton animation="wave" width={'95%'} variant='text'/>}/>
            <CardContent className={classes.cardPadding}>
              {bx === 2 || bx === 4 ? <TaskSkeleton num={[1, 2]}/> :
                <TaskSkeleton num={skeletonNum}/>}
            </CardContent>
          </Card>
        </Grid>
      ))}
      <Grid item xs={4} style={{maxWidth: 'max-content'}}>
        <Card variant='outlined' style={{background: 'transparent'}}>
          <CardActionArea style={{padding: "1rem"}}>
            <Typography variant="h6"><Skeleton animation="wave" variant='text' width={180}/></Typography>
          </CardActionArea>
        </Card>
      </Grid>
    </>
  );
};

// ProductPageBoardsSkeleton.propTypes = {};

export default ProductPageBoardsSkeleton;