import React, { useState, useEffect } from "react";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import TestSingleAlgorithm from "./pages/TestSingleAlgorithm";
import TestMultipleAlgorithms from "./pages/TestMultipleAlgorithms";
import AddAlgorithmDll from "./pages/AddAlgorithmDll";
import { Routes, Route } from "react-router-dom";
import api from "./components/apiConfig";

import { Container, CssBaseline } from "@mui/material";
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
              />
            }
          />
          <Route
            path="/MetaHeuristicAlgorithmsTesterFrontend/testMultiple"
            element={<TestMultipleAlgorithms />}
          />
          <Route
            path="/MetaHeuristicAlgorithmsTesterFrontend/addAlgorithm"
            element={<AddAlgorithmDll />}
          />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;
