import React from 'react';
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Skeleton from "@material-ui/core/Skeleton";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";


const skeletonNum = [1, 2, 3]
const ProductPageBoardsSkeleton = () => {
  return (
    <>
      {skeletonNum.map(bx => (
        <Grid item key={bx} xs={4} style={{maxWidth: '260px'}}>
          <Card>
            <CardHeader title={<Skeleton animation="wave" variant='text'/>}/>
            <CardContent>
              {skeletonNum.map(x => (
                <div key={x} style={{margin: '.5rem 0px'}}>
                  {bx !== 2 ?
                    <Card>
                      <CardActionArea style={{display: 'block'}} component='div'>
                        <CardHeader
                          title={<Skeleton animation="wave" variant='text' height={20}/>}
                          subheader={<Skeleton animation="wave" variant='text' width='45%' height={10}/>}
                        />
                      </CardActionArea>
                    </Card> : <div key={2}/>}
                </div>
              ))}
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