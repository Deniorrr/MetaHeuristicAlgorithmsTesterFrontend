import React, { useState, useEffect } from "react";
import api from "./components/apiConfig";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import InputSlider from "./components/InputSlider";

import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Card,
  Grid,
  CardContent,
  Container,
  CssBaseline,
  Box,
  Typography,
  TextField,
  Input,
} from "@mui/material";
import "./App.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [algorithms, setAlgorithms] = useState([]);
  const [fitnessFunctions, setFitnessFunctions] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [selectedFitnessFunction, setSelectedFitnessFunction] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [parametersValues, setParametersValues] = useState({});
  const theme = useTheme();

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
      .get("http://localhost:3001/api/get")
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        setFitnessFunctions([
          { name: "f1", id: 0 },
          { name: "f2", id: 1 },
          { name: "f3", id: 2 },
        ]);
      });
  };

  const initializeParametersValues = (parameters) => {
    const parametersValues = {};
    parameters.forEach((parameter) => {
      parametersValues[parameter.id] = parameter.lowerBoundary;
    });
    setParametersValues(parametersValues);
  };

  const changeParameterValue = (parameterId, value) => {
    console.log(parameterId, value);
    setParametersValues({ ...parametersValues, [parameterId]: value });
  };

  useEffect(() => {
    if (selectedAlgorithm) {
      const selected = algorithms.algorithms.find(
        (algorithm) => algorithm.id === parseInt(selectedAlgorithm, 10)
      );
      setParameters([selected.parameters]);
      initializeParametersValues(selected.parameters);
    }
  }, [selectedAlgorithm]);

  useEffect(() => {
    console.log("parameters", parameters);
  }, [parameters]);

  useEffect(() => {
    fetchAlgorithms();
    fetchFitnessFunction();
  }, []);

  const renderAlgorithms = () => {
    return (
      <Card>
        <CardContent>
          <FormControl>
            <FormLabel>Algorithms</FormLabel>
            <RadioGroup
              value={selectedAlgorithm}
              onChange={(event) => {
                setSelectedAlgorithm(event.target.value);
              }}
            >
              {algorithms.algorithms && Array.isArray(algorithms.algorithms)
                ? algorithms.algorithms.map((algorithm) => {
                    return (
                      <FormControlLabel
                        value={algorithm.id}
                        control={<Radio />}
                        label={algorithm.name}
                      />
                    );
                  })
                : null}
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>
    );
  };

  const renderFitnessFunctions = () => {
    return (
      <Card>
        <CardContent>
          <FormControl>
            <FormLabel>FitnessFunctions</FormLabel>
            <RadioGroup
              value={selectedFitnessFunction}
              onChange={(event) => {
                setSelectedFitnessFunction(event.target.value);
              }}
            >
              {fitnessFunctions.map((fitnessFunction) => {
                return (
                  <FormControlLabel
                    value={fitnessFunction.id}
                    control={<Radio />}
                    label={fitnessFunction.name}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>
    );
  };

  const renderParameters = () => {
    if (parameters.length === 0) return null;
    return (
      <>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              {parameters[0].map((parameter) => (
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  key={parameter.name}
                >
                  <Grid item xs={12}>
                    <InputSlider
                      changeParameterValue={changeParameterValue}
                      minValue={parameter.lowerBoundary}
                      maxValue={parameter.upperBoundary}
                      name={parameter.name}
                      id={parameter.id}
                      isFloatingPoint={true}
                      // isFloatingPoint={parameter.isFloatingPoint}
                    />
                  </Grid>
                </Grid>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" onClick={sendRequest} size="large">
            Send
          </Button>
        </Grid>
      </>
    );
  };
  const sendRequest = async () => {
    console.log(selectedAlgorithm);
    console.log(selectedFitnessFunction);
    console.log(parametersValues);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container style={{ marginTop: theme.spacing(2) }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {renderAlgorithms()}
              </Grid>
              <Grid item xs={12}>
                {renderFitnessFunctions()}
              </Grid>

              {renderParameters()}
            </Grid>
          </Grid>
          <Grid item xs={9}>
            <Card>
              <CardContent>Result</CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
