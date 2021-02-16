import React from 'react';
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const Home = () => {
    return (
        <Box component="main" sx={{mt: 2}}>
            <Container maxWidth="sm">
                <Typography variant="h5" component="h2">Your projects</Typography>
                {/*<Divider style={{marginBottom: 8}}/>*/}
                {/*{lists.map(list => <Box sx={{mb: 2}} key={list}><ProjectHome/></Box>)}*/}
            </Container>
        </Box>
    );
}

export default Home;