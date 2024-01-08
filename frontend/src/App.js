import React, { useState, useEffect } from "react";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import TestSingleAlgorithm from "./pages/TestSingleAlgorithm";
import TestMultipleAlgorithms from "./pages/TestMultipleAlgorithms";
import AddAlgorithmDll from "./pages/AddAlgorithmDll";
import AddFitnessFunction from "./pages/AddFitnessFunction";
import { Routes, Route } from "react-router-dom";
import api from "./components/apiConfig";
import TransitionAlerts from "./components/TransitionAlerts";

import { Container, CssBaseline, Box, Button } from "@mui/material";
import "./App.css";
import Navbar from "./pages/Navbar";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const theme = useTheme();
  const [algorithms, setAlgorithms] = useState([]);
  const [fitnessFunctions, setFitnessFunctions] = useState([]);
  const [alerts, setAlerts] = useState([]); // {severity: "success", message: "Algorithm added successfully"}

  const fetchAlgorithms = async () => {
    api
      .get("Algorithms")
      .then((response) => {
        console.log(response.data);
        setAlgorithms(response.data);
      })
      .catch((error) => {
        console.log(error);
        setAlgorithms([
          { name: "a1", id: 0 },
          { name: "a2", id: 1 },
          { name: "a3", id: 2 },
        ]);
      });
  };

  const renderTransitionAlerts = () => {
    return alerts.map((alert) => {
      return (
        <TransitionAlerts severity={alert.severity} message={alert.message} />
      );
    });
  };

  const addAlert = (_severity, _message) => {
    setAlerts([...alerts, { severity: _severity, message: _message }]);
  };
  const addAlgorithm = (newAlgorithm) => {
    console.log(algorithms);
    console.log(newAlgorithm);
    //add algorithm to algorithms.algorithms
    algorithms.algorithms.push(newAlgorithm);
    setAlgorithms(algorithms);
  };
  const addFitnessFunction = (newFitnessFunction) => {
    fitnessFunctions.fitnessFunctions.push(newFitnessFunction);
    setFitnessFunctions(fitnessFunctions);
  };

  const fetchFitnessFunction = async () => {
    api
      .get("fitnessfunction")
      .then((response) => {
        console.log("FF", response);
        setFitnessFunctions(response.data);
      })
      .catch((error) => {
        setFitnessFunctions([
          { name: "f1", id: 0 },
          { name: "f2", id: 1 },
          { name: "f3", id: 2 },
        ]);
      });
  };
  useEffect(() => {
    fetchAlgorithms();
    fetchFitnessFunction();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <Container style={{ marginTop: theme.spacing(2) }}>
        <Routes>
          <Route
            path="/MetaHeuristicAlgorithmsTesterFrontend"
            element={
              <TestSingleAlgorithm
                algorithms={algorithms}
                ffunctions={fitnessFunctions}
                addAlert={addAlert}
              />
            }
          />
          <Route
            path="/MetaHeuristicAlgorithmsTesterFrontend/testMultiple"
            element={<TestMultipleAlgorithms />}
          />
          <Route
            path="/MetaHeuristicAlgorithmsTesterFrontend/addAlgorithm"
            element={
              <AddAlgorithmDll
                addAlgorithm={addAlgorithm}
                addAlert={addAlert}
              />
            }
          />
          <Route
            path="/MetaHeuristicAlgorithmsTesterFrontend/addFitnessFunction"
            element={
              <AddFitnessFunction
                addFitnessFunction={addFitnessFunction}
                addAlert={addAlert}
              />
            }
          />
        </Routes>
      </Container>
      <Box sx={{ position: "fixed", bottom: 0 }}>
        {renderTransitionAlerts()}
      </Box>
    </ThemeProvider>
  );
}

export default App;