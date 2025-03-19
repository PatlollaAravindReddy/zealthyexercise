import React, { useContext, useState, useEffect } from 'react';
import { Button, TextField, Typography, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { multiStepContext } from '../../StepContex';
import { getOnboardingConfig } from '../../services/api';

function PageThree() {
  const { setStep, userData, setUserData, submitData } = useContext(multiStepContext);
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
    };

    fetchConfig();
  }, []);

  const handleSubmit = async () => {
      const response = await submitData(userData);
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

  const handleDialogClose = () => {
    setOpenDialog(false);
    setUserData('');
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
              onChange={(e) => setUserData({ ...userData, 'streetAddress': e.target.value })}
              fullWidth
            />
            <TextField
              label="City"
              margin="normal"
              value={userData['city'] || ''}
              onChange={(e) => setUserData({ ...userData, 'city': e.target.value })}
              fullWidth
            />
            <TextField
              label="State"
              margin="normal"
              value={userData['state'] || ''}
              onChange={(e) => setUserData({ ...userData, 'state': e.target.value })}
              fullWidth
            />
            <TextField
              label="Zip Code"
              margin="normal"
              value={userData['zipCode'] || ''}
              onChange={(e) => setUserData({ ...userData, 'zipCode': e.target.value })}
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
                  margin="normal"
                  value={userData['aboutMe'] || ''}
                  onChange={(e) => setUserData({ ...userData, 'aboutMe': e.target.value })}
                  fullWidth
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
                  onChange={(e) => setUserData({ ...userData, 'birthdate': e.target.value })}
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
          onClick={() => setStep(2)}
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
