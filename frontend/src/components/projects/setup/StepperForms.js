import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import StepContent from "@material-ui/core/StepContent";
import StepLabel from "@material-ui/core/StepLabel";
import ProjectSetupForm from "./ProjectDetailsForm";
import BoardsDetailsForm from "./BoardsDetailsForm";
import TaskDetailsForm from "./TaskDetailsForm";
import produce from "immer";

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 400,
  },
}));

const ProjectForms = ({
  projectState,
  setProjectState,
  visibility,
  setVisibility,
}) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    if (activeStep === 1) {
      setVisibility(
        produce(visibility, (draft) => {
          draft.boards = true;
          draft.tasks = false;
        })
      );
    } else if (activeStep === 2) {
      setVisibility(
        produce(visibility, (draft) => {
          draft.boards = true;
          draft.tasks = true;
        })
      );
    } else {
      setVisibility(
        produce(visibility, (draft) => {
          draft.boards = false;
          draft.tasks = false;
        })
      );
    }
  }, [activeStep, setVisibility, visibility]);

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>
            <Typography component="h2" variant="h5">
              basic project details
            </Typography>
          </StepLabel>
          <StepContent>
            <ProjectSetupForm
              projectState={projectState}
              setProjectState={setProjectState}
            />
            <div style={{ textAlign: "end" }}>
              <Button
                onClick={handleNext}
                variant="text"
                color="primary"
                disabled={
                  !projectState.project.name || !projectState.project.deadline
                }>
                next
              </Button>
            </div>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>
            <Typography component="h2" variant="h5">
              create some boards
            </Typography>
          </StepLabel>
          <StepContent>
            <BoardsDetailsForm
              projectState={projectState}
              setProjectState={setProjectState}
            />
            <div style={{ display: "block", textAlign: "end" }}>
              <Button onClick={handleBack} variant="text" color="primary">
                back
              </Button>
              <Button
                onClick={handleNext}
                variant="text"
                color="primary"
                disabled={
                  !projectState.boards.name1 || !projectState.boards.name2
                }>
                next
              </Button>
            </div>
          </StepContent>
        </Step>
        <Step>
          <StepLabel>
            <Typography component="h2" variant="h5">
              add some tasks
            </Typography>
          </StepLabel>
          <StepContent>
            <TaskDetailsForm
              projectState={projectState}
              setProjectState={setProjectState}
            />
            <div style={{ display: "block", textAlign: "end" }}>
              <Button onClick={handleBack} variant="text" color="primary">
                back
              </Button>
              <Button
                // onClick={handleNext}
                variant="text"
                color="secondary"
                disableElevation
                disabled={
                  !projectState.tasks.name1 || !projectState.tasks.name2
                }
                style={{ fontWeight: 700 }}>
                create project
              </Button>
            </div>
          </StepContent>
        </Step>
      </Stepper>
    </div>
  );
};

ProjectForms.propTypes = {
  projectState: PropTypes.shape({
    boards: PropTypes.shape({
      name1: PropTypes.string,
      name2: PropTypes.string,
    }),
    project: PropTypes.shape({
      deadline: PropTypes.string,
      name: PropTypes.string,
    }),
    tasks: PropTypes.shape({
      name1: PropTypes.string,
      name2: PropTypes.string,
    }),
  }),
  setProjectState: PropTypes.func,
  setVisibility: PropTypes.func,
  visibility: PropTypes.object,
};

export default ProjectForms;
