import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Zoom from "@material-ui/core/Zoom";
import StepperForms from "./StepperForms";
import Box from "@material-ui/core/Box";
import BoardCard from "../../boards/Boards";

const SetupPreviewPage = () => {
  const tomrr = new Date().toISOString();
  const [projectState, setProjectState] = useState({
    project: {
      name: "Name of the project",
      description: "Give it some descripition",
      deadline: tomrr.substring(0, tomrr.length - 8),
    },
    boards: {
      name1: "still todo",
      name2: "currently doing",
      name3: "done",
    },

    tasks: {
      name1: "find perfect topic",
      name2: "do some research on the topic",
      name3: "publish the research findings",
    },
  });

  const [visibility, setVisibility] = useState({
    boards: false,
    tasks: false,
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 3 }} style={{ textAlign: "center" }}>
        <Typography component="h2" variant="h6">
          Lets do some basic setup
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Container style={{ padding: 0 }}>
            {/* <Card> */}
            <StepperForms
              projectState={projectState}
              setProjectState={setProjectState}
              visibility={visibility}
              setVisibility={setVisibility}
            />
            {/* </Card> */}
          </Container>
        </Grid>
        <Grid item container xs={12} md={8}>
          <Container style={{ padding: 0 }}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ my: 3 }} style={{ textAlign: "center" }}>
                  <Typography component="h1" variant="h5">
                    {projectState.project.name}
                  </Typography>
                </Box>
                <Zoom in={visibility.boards}>
                  <Grid container spacing={1}>
                    {Object.keys(projectState.boards).map((board, idx) => {
                      return (
                        <Grid key={idx} item xs={12} sm={6} lg={4}>
                          <BoardCard
                            name={projectState.boards[board]}
                            tasks={idx === 0 ? projectState.tasks : ""}
                            visibility={visibility.tasks}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Zoom>
              </CardContent>
            </Card>
          </Container>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SetupPreviewPage;
