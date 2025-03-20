import React, { useContext, useState, useEffect } from 'react';
import { Button, TextField, Typography, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { multiStepContext } from '../../StepContex';
import { getOnboardingConfig, submitUserDetails } from '../../services/api';
import { loadSessionData } from '../../utils/sessionUtils';

function PageThree() {
  const { setStep, userData, setUserData } = useContext(multiStepContext);
  const [page2Components, setPage2Components] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const defaultConfig = await getOnboardingConfig();
        const page2Config = defaultConfig.find(config => config.pageNumber === 3);
        if (page2Config) {
          setPage2Components(JSON.parse(page2Config.componentName));
        }
      } catch (error) {
        console.error('Failed to fetch configuration:', error);
      }
      loadSessionData(setUserData, setStep);
      setUserData(prevData => ({
        ...prevData,
        id: JSON.parse(sessionStorage.getItem('sessionId'))?.id
      }));
    };

    fetchConfig();
  }, []);

  const handleSubmit = async () => {
    const response = await submitUserDetails(userData);
    if (response.success) {
      setSubmitStatus('success');
      setErrorMessage('');
    } else {
      setSubmitStatus('failure');
      setErrorMessage(response.message || 'An unknown error occurred.');
    }
    setOpenDialog(true);
  };

  const isAddressPresent = page2Components.includes('Address');
  const isAboutMePresent = page2Components.includes('About Me');
  const isBirthdatePresent = page2Components.includes('Birthdate');

  const isSideBySide = isAddressPresent && (isAboutMePresent || isBirthdatePresent);

  const updateUserDataAndSession = (newUserData) => {
    setUserData(newUserData);
    sessionStorage.setItem('sessionData', JSON.stringify(newUserData));
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setUserData('');
    sessionStorage.clear();
    setStep(1);

  };

  return (
    <div className="form-container">
      <Grid container spacing={4}>
        {isAddressPresent && (
          <Grid item xs={12} md={isSideBySide ? 6 : 12}>
            <Typography variant="h6" className="section-heading">Address</Typography>
            <TextField
              label="Street"
              margin="normal"
              value={userData['streetAddress'] || ''}
              onChange={(e) => updateUserDataAndSession({ ...userData, 'streetAddress': e.target.value })}
              fullWidth
            />
            <TextField
              label="City"
              margin="normal"
              value={userData['city'] || ''}
              onChange={(e) => updateUserDataAndSession({ ...userData, 'city': e.target.value })}
              fullWidth
            />
            <TextField
              label="State"
              margin="normal"
              value={userData['state'] || ''}
              onChange={(e) => updateUserDataAndSession({ ...userData, 'state': e.target.value })}
              fullWidth
            />
            <TextField
              label="Zip Code"
              margin="normal"
              value={userData['zipCode'] || ''}
              onChange={(e) => updateUserDataAndSession({ ...userData, 'zipCode': e.target.value })}
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                  e.preventDefault();
                }
              }}
              fullWidth
            />
          </Grid>
        )}

        {(isAboutMePresent || isBirthdatePresent) && (
          <Grid item xs={12} md={isSideBySide ? 6 : 12}>
            {isAboutMePresent && (
              <>
                <Typography variant="h6" className="section-heading">About Me</Typography>
                <TextField
                  label="About Me"
                  value={userData['aboutMe'] || ''}
                  onChange={(e) => updateUserDataAndSession({ ...userData, aboutMe: e.target.value })}
                  fullWidth
                  multiline
                  rows={4} // Adjust rows as needed
                  variant="outlined"
                />
              </>
            )}

            {isBirthdatePresent && (
              <div>
                <Typography variant="h6" className="section-heading">Birthdate</Typography>
                <TextField
                  label="Birthdate"
                  type="date"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={userData['birthdate'] || ''}
                  onChange={(e) => updateUserDataAndSession({ ...userData, 'birthdate': e.target.value })}
                  fullWidth
                />
              </div>
            )}
          </Grid>
        )}
      </Grid>

      <div className="button-container">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            const userStepToSave = {
              step: 2,
            };
            sessionStorage.setItem('sessionStep', JSON.stringify(userStepToSave));
            setStep(2)
          }}
          fullWidth
          className="nav-button"
        >
          Back
        </Button>
        <Button variant='contained' color="primary" fullWidth
          className="nav-button" onClick={handleSubmit}>Submit
        </Button>
      </div>

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

export default PageThree;
