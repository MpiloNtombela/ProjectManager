import React from 'react';
import CssBaseline from "@material-ui/core/CssBaseline";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Skeleton from "@material-ui/core/Skeleton";
import {useComponentStyles} from "../styles/componentStyles";
import Divider from "@material-ui/core/Divider";
import CardActionArea from "@material-ui/core/CardActionArea";
import Grid from "@material-ui/core/Grid";


export function FormSkeleton() {
    const skeletonNum = ["h3", "h3", "h3", "h3"]

    const classes = useComponentStyles()
    return (
        <Container className={classes.paper} component="main" maxWidth="xs">
            <CssBaseline/>
            <Card style={{width: '100%'}}>
                <CardContent>
                    <Typography variant="h2">
                        <Skeleton animation="wave"/>
                    </Typography>
                    <Grid container spacing={2}>
                        {skeletonNum.map((skeleton, idx) => (
                            <Grid item xs={6} key={idx}>
                                <Typography variant={skeleton}>
                                    <Skeleton animation="wave"/>
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                    <Typography variant="h3">
                        <Skeleton animation="wave"/>
                    </Typography>
                    <Typography variant="h4"><Skeleton animation="wave" width="50%"/></Typography>
                </CardContent>
            </Card>
        </Container>
    );
}

export default FormSkeleton