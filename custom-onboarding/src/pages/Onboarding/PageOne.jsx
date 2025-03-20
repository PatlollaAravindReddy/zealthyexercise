import React, { useContext, useState, useEffect } from 'react';
import { Button, TextField, Stepper, StepLabel, Step, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { multiStepContext } from '../../StepContex';
import PageTwo from './PageTwo';
import PageThree from './PageThree';
import './PageOne.css';

function PageOne() {
  const { currentStep, setStep, userData, setUserData, submitData } = useContext(multiStepContext);
  const [submitStatus, setSubmitStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('sessionData');
    const storedStep = sessionStorage.getItem('sessionStep');
    const userId = sessionStorage.getItem('sessionId');
    if (storedUserData && storedStep && userId) {
      const parsedData = JSON.parse(storedUserData);
      const parsedStep = JSON.parse(storedStep);
      setUserData({ id: userId });
      setUserData(parsedData);
      setStep(parsedStep.step);
    }
  }, []);


  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return (password || "").length >= 6;
  };

  const handleSubmit = async () => {
    const response = await submitData(userData);
    if (response.success) {
      const userStepToSave = {
        step: 2,
      };
      const userIdToSave = {
        id: response.message,
      };
      const { password, ...safeUserData } = userData;
      sessionStorage.setItem('sessionId', JSON.stringify(userIdToSave));
      sessionStorage.setItem('sessionStep', JSON.stringify(userStepToSave));
      sessionStorage.setItem('sessionData', JSON.stringify(safeUserData));
      setSubmitStatus('success');
      setErrorMessage('');
      userData['id'] = response.message;
    } else {
      setSubmitStatus('failure');
      setErrorMessage(response.message || 'An unknown error occurred.');
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    if (submitStatus === 'success') {
      setStep(2);
    } else {
      setUserData({ email: '', password: '' });
      setStep(1);
    }
  };


  const handleEmailChange = (e) => {
    const email = e.target.value;
    setUserData({ ...userData, email });
    if (!validateEmail(email)) {
      setErrors({ ...errors, email: 'Please enter a valid email address.' });
    } else {
      setErrors({ ...errors, email: '' });
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setUserData({ ...userData, password });
    if (!validatePassword(password)) {
      setErrors({ ...errors, password: 'Password must be at least 6 characters long.' });
    } else {
      setErrors({ ...errors, password: '' });
    }
  };

  useEffect(() => {
    if (validateEmail(userData.email) && validatePassword(userData.password)) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [userData.email, userData.password]);

  function showStep(step) {
    switch (step) {
      case 1:
        return (
          <div className="form-container">
            <TextField
              label="Email"
              value={userData['email']}
              onChange={handleEmailChange}
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Password"
              type="password"
              value={userData['password']}
              onChange={handlePasswordChange}
              margin="normal"
              error={!!errors.password}
              helperText={errors.password}
            />

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!formValid}
            >
              Next
            </Button>
          </div>
        );
      case 2:
        return <PageTwo />;
      case 3:
        return <PageThree />;
      default:
        return null;
    }
  }

  return (
    <div className="page-container">
      <div className="header">Custom Onboarding Flow</div>

      <Stepper className="center-stepper" activeStep={currentStep - 1}>
        <Step><StepLabel /></Step>
        <Step><StepLabel /></Step>
        <Step><StepLabel /></Step>
      </Stepper>

      {showStep(currentStep)}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{submitStatus === 'success' ? 'Success' : 'Failure'}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {submitStatus === 'success'
              ? 'Your data has been successfully submitted!'
              : errorMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PageOne;
