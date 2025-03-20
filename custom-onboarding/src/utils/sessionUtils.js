export const loadSessionData = (setUserData, setStep) => {
    const storedUserData = sessionStorage.getItem('sessionData');
    const storedStep = sessionStorage.getItem('sessionStep');
    const userId = sessionStorage.getItem('sessionId');
    if (storedUserData && storedStep && userId) {
      const parsedData = JSON.parse(storedUserData);
      const parsedStep = JSON.parse(storedStep);
      setUserData(prevState => ({
        ...prevState,
        ...parsedData,
        id: JSON.parse(userId).id,
      }));
      setStep(parsedStep.step);
    }
  };
  