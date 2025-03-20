import React, { useState } from "react";
import App from "./App";
import { submitUserData } from './services/api';

export const multiStepContext = React.createContext();

const StepContext = () => {
    const [currentStep, setStep] = useState(1);
    const [userData, setUserData] = useState([]);
    const [finalData, setFinalData] = useState([]);
    const [setSubmitStatus] = useState('');
    const [setErrorMessage] = useState('');
    const submitData = async () => {
        const { success, message } = await submitUserData(userData);
        return { success, message };
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
