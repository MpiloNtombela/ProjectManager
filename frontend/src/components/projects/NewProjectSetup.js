import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ProjectForms from "./ProjectsForms";
import Box from "@material-ui/core/Box";

function ProjectForm(props) {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Container style={{ padding: 0 }}>
              <Card>
                <ProjectForms />
              </Card>
            </Container>
          </Grid>
          <Grid item container xs={12} md={7}>
            <Container style={{ padding: 0 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    component="h1"
                    variant="h5">
                    Project Name
                  </Typography>
                </CardContent>
              </Card>
            </Container>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default ProjectForm;
