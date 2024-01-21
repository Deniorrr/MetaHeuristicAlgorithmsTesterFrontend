import React, { useEffect, useState } from "react";
import api from "../components/apiConfig";
import { Button } from "@mui/material";

function CheckSingle() {
  const [executedAlgorithms, setExecutedAlgorithms] = useState([]);

  useEffect(() => {
    fetchSingles();
  }, []);

  const sendContinueRequest = async () => {};

  const renderAlgorithms = () => {
    const elements = executedAlgorithms.map((executedAlgorithm) => {
      return (
        <>
          <p>
            {executedAlgorithm.testedAlgorithmName},
            {executedAlgorithm.testedFitnessFunctionName},
            {executedAlgorithm.fBest}
            <Button
              variant="outlined"
              onClick={() => {
                sendContinueRequest(executedAlgorithm.id);
              }}
            >
              Continue
            </Button>
          </p>
        </>
      );
    });
    return elements;
  };

  const fetchSingles = async () => {
    const response = await api.get("/executedSingleAlgorithms");
    setExecutedAlgorithms(response.data.executedAlgorithms);
    console.log(response.data.executedAlgorithms);
  };
  return (
    <div>
      <h1>Single Algorithms</h1>
      {renderAlgorithms()}
    </div>
  );
}

export default CheckSingle;
