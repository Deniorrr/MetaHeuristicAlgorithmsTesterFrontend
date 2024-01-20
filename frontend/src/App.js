import React, { useState, useEffect } from "react";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import CheckSingle from "./pages/CheckSingle";
import CheckMultiple from "./pages/CheckMultiple";
import TestSingleAlgorithm from "./pages/TestSingleAlgorithm";
import TestMultipleAlgorithms from "./pages/TestMultipleAlgorithms";
import AddAlgorithmDll from "./pages/AddAlgorithmDll";
import AddFitnessFunction from "./pages/AddFitnessFunction";
import { Routes, Route } from "react-router-dom";
import api from "./components/apiConfig";

import TransitionAlerts from "./components/TransitionAlerts";

import { Container, CssBaseline, Box } from "@mui/material";
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
      });
  };

  const deleteFitnessFunction = async (id) => {
    api
      .delete(`fitnessfunction/${id}`)
      .then((response) => {
        console.log(response);
        addAlert("success", response.data);
        fitnessFunctions.fitnessFunctions =
          fitnessFunctions.fitnessFunctions.filter(
            (fitnessFunction) => fitnessFunction.id !== id
          );
      })
      .catch((error) => {
        addAlert("error", error.response.data);
      });
  };

  const deleteAlgorithm = async (id) => {
    api
      .delete(`algorithms/${id}`)
      .then((response) => {
        console.log(response);
        addAlert("success", response.data);
        algorithms.algorithms = algorithms.algorithms.filter(
          (algorithm) => algorithm.id !== id
        );
      })
      .catch((error) => {
        addAlert("error", error.response.data);
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
    console.log(fitnessFunctions);
    console.log(newFitnessFunction);
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
        setFitnessFunctions([]);
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
                deleteFitnessFunction={deleteFitnessFunction}
                deleteAlgorithm={deleteAlgorithm}
              />
            }
          />
          <Route
            path="/MetaHeuristicAlgorithmsTesterFrontend/testMultiple"
            element={
              <TestMultipleAlgorithms
                algorithms={algorithms}
                ffunctions={fitnessFunctions}
                addAlert={addAlert}
                deleteFitnessFunction={deleteFitnessFunction}
                deleteAlgorithm={deleteAlgorithm}
              />
            }
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
          <Route
            path="/MetaHeuristicAlgorithmsTesterFrontend/checkSingleStatus"
            element={<CheckSingle />}
          />
          <Route
            path="/MetaHeuristicAlgorithmsTesterFrontend/checkMultipleStatus"
            element={<CheckMultiple />}
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
