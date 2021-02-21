import React from 'react';
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/core/Skeleton";
import ProductPageBoardsSkeleton from "./ProductPageBoardsSkeleton";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  hideScroll: {
    overflowX: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
})
const ProjectPageSkeleton = () => {
  const classes = useStyles()
  return (
    <>
      <Typography component="h1" variant="h4" style={{marginLeft: '.75rem'}}>
        <Skeleton animation="wave" variant='text' width='60%'/>
      </Typography>
      <Container className={classes.hideScroll} maxWidth="xl">
        <Box sx={{py: 3}}>
          <Grid container spacing={1} style={{
            display: 'grid',
            gridAutoColumns: '270px',
            gridAutoFlow: 'column'
          }}>
            <ProductPageBoardsSkeleton/>
          </Grid>
        </Box>
      </Container>
    </>
  )
}

export default ProjectPageSkeleton;