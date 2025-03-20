import React, { useState, useEffect } from 'react';
import { getOnboardingConfig, saveOnboardingConfig } from '../services/api';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import './Admin.css';

const Admin = () => {
  const components = ['About Me', 'Address', 'Birthdate'];

  const [page2Components, setPage2Components] = useState([]);
  const [page3Components, setPage3Components] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    const fetchDefaultConfig = async () => {
      try {
        const defaultConfig = await getOnboardingConfig();
        const page2Config = defaultConfig.find(config => config.pageNumber === 2);
        const page3Config = defaultConfig.find(config => config.pageNumber === 3);
        setPage2Components(page2Config ? JSON.parse(page2Config.componentName) : ['About Me']);
        setPage3Components(page3Config ? JSON.parse(page3Config.componentName) : ['Address']);
      } catch (error) {
        console.error('Failed to fetch default configuration:', error);
      }
    };

    fetchDefaultConfig();
  }, []);

  const handlePage2Toggle = (component) => {
    setPage2Components((prev) => {
      const updated = prev.includes(component)
        ? prev.filter(item => item !== component)
        : [...prev, component];
      setChangesMade(true);
      return updated.length > 0 ? updated : ['About Me'];
    });
  };

  const handlePage3Toggle = (component) => {
    setPage3Components((prev) => {
      const updated = prev.includes(component)
        ? prev.filter(item => item !== component)
        : [...prev, component];
      setChangesMade(true);
      return updated.length > 0 ? updated : ['Address'];
    });
  };

  const handleSave = async () => {
    try {
      const savedConfig = await saveOnboardingConfig(page2Components, page3Components);
      setSaveStatus('success');
      setChangesMade(false);
    } catch (error) {
      console.error('Failed to save configuration:', error);
      setSaveStatus('failure');
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <div className="form-container">
      <div className="header">Admin - Custom Onboarding</div>

      <div className="input-container">
        <div>
          <h2>Select Components for Page 2</h2>
          {components.map((component) => (
            <div key={component}>
              <label>
                <input
                  type="checkbox"
                  checked={page2Components.includes(component)}
                  onChange={() => handlePage2Toggle(component)}
                  disabled={page3Components.length === 3 || page3Components.includes(component)}
                />
                {component}
              </label>
            </div>
          ))}
        </div>

        <div>
          <h2>Select Components for Page 3</h2>
          {components.map((component) => (
            <div key={component}>
              <label>
                <input
                  type="checkbox"
                  checked={page3Components.includes(component)}
                  onChange={() => handlePage3Toggle(component)}
                  disabled={page2Components.length === 3 || page2Components.includes(component)}
                />
                {component}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="button-container">
        <Button
          variant="contained"
          className="nav-button"
          onClick={handleSave}
          disabled={!changesMade}
        >
          Save Configuration
        </Button>
      </div>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogContent>
          <p>{saveStatus === 'success' ? 'The configuration has been saved successfully.' : 'There was an error saving the configuration.'}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Admin;
