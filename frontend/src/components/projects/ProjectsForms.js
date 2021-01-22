import React, { useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import StepContent from "@material-ui/core/StepContent";
import StepLabel from "@material-ui/core/StepLabel";
import ProjectSetupForm from "./setup/ProjectSetupForm";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

const steps = [
  {
    label: "Select campaign settings",
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
  },
  {
    label: "Create an ad group",
    description:
      "An ad group contains one or more ads which target a shared set of keywords.",
  },
  {
    label: "Create an ad",
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
];

const ProjectForms = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const projInitState = {
    projectName: "",
    description: "",
    deadline: "",
  };
  const [project, setProject] = useState(projInitState);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>
            <Typography component="h2" variant="h5">
              Setup the project
            </Typography>
          </StepLabel>
          <StepContent>
            <ProjectSetupForm project={project} setProject={setProject} />
            <div style={{ display: "block", textAlign: "end" }}>
              <Button
                onClick={handleNext}
                variant="text"
                color="primary"
                disabled={!project.projectName || !project.deadline}>
                next
              </Button>
            </div>
          </StepContent>
        </Step>
      </Stepper>
    </div>
  );
};

export default ProjectForms;
