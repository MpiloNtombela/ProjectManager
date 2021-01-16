import React from 'react';
import {connect} from "react-redux";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
// import ProjectHome from "./projects/ProjectHome";
import Typography from "@material-ui/core/Typography";
import {useSpacingStyles} from "./styles/commonStyles";
import Divider from "@material-ui/core/Divider";

const Home = ({auth}) => {
    const cls = useSpacingStyles()
    const lists = [1, 2, 3, 5, 6, 7]
    const lists2 = [1, 2, 3]
    return (
        <Box component="main" sx={{mt: 2}}>
            <Container maxWidth="sm">
                <Typography variant="subtitle1" component="h1">All projects you're part of</Typography>
                <Divider style={{marginBottom: 8}}/>
                {/*{lists.map(list => <Box sx={{mb: 2}} key={list}><ProjectHome/></Box>)}*/}
            </Container>
        </Box>
    );
}

const mapStateToProps = state => ({
    auth: state.auth
})
export default connect(mapStateToProps)(Home);