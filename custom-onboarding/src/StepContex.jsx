import React, { useState } from "react";
import App from "./App";
import { submitUserData } from './services/api';

export const multiStepContext = React.createContext();

const StepContext = () => {
    const [currentStep, setStep] = useState(1);
    const [userData, setUserData] = useState([]);
    const [finalData, setFinalData] = useState([]);
    const submitData = async () => {
        try {
            const { success, message } = await submitUserData(userData);
            setSubmitStatus(success ? 'success' : 'failure');
            setErrorMessage(success ? '' : message || 'Something went wrong. Please try again.');
        } catch (error) {
            setSubmitStatus('failure');
            setErrorMessage(error.message || 'An unknown error occurred. Please try again.');
        }
        setUserData('');
        setStep(1);
    };
    return (
        <div>
            <multiStepContext.Provider value={{ currentStep, setStep, userData, setUserData, finalData, setFinalData, submitData }}>
                <App />
            </multiStepContext.Provider>
        </div>
    );
}

export default StepContext;
