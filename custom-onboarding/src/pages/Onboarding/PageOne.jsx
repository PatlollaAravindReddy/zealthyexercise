import React, { useContext, useState, useEffect } from 'react';
import { Button, TextField, Stepper, StepLabel, Step } from '@mui/material';
import { multiStepContext } from '../../StepContex';
import PageTwo from './PageTwo';
import PageThree from './PageThree';
import './PageOne.css';

function PageOne() {
  const { currentStep, setStep, userData, setUserData } = useContext(multiStepContext);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [formValid, setFormValid] = useState(false);

  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return (password || "").length >= 6;
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
              onClick={() => setStep(2)}
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
    </div>
  );
}

export default PageOne;
