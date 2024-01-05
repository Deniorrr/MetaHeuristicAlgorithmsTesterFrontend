import React, { useState, useEffect } from "react";
import api from "../components/apiConfig";
import axios from "axios";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import InputSlider from "../components/InputSlider";

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
  Typography,
} from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function TestSingleAlgorithm(props) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [selectedFitnessFunction, setSelectedFitnessFunction] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [parametersValues, setParametersValues] = useState({});
  const theme = useTheme();
  const [algorithms, setAlgorithms] = useState([]);
  const [fitnessFunctions, setFitnessFunctions] = useState([]);
  const [RequestResult, setRequestResult] = useState({});

  const initializeParametersValues = (parameters) => {
    const parametersValues = [];
    parameters.forEach((parameter) => {
      parametersValues[parameter.id] = parameter.lowerBoundary;
    });
    setParametersValues(parametersValues);
  };

  useEffect(() => {
    setAlgorithms(props.algorithms);
    setFitnessFunctions(props.ffunctions);
  }, [props.algorithms, props.ffunctions]);

  const changeParameterValue = (index, value) => {
    const newParametersValues = [...parametersValues];
    newParametersValues[index] = value;
    setParametersValues(newParametersValues);
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

  // useEffect(() => {
  //   fetchAlgorithms();
  //   fetchFitnessFunction();
  // }, []);

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
              {fitnessFunctions.fitnessFunctions &&
              Array.isArray(fitnessFunctions.fitnessFunctions)
                ? fitnessFunctions.fitnessFunctions.map((fitnessFunction) => {
                    return (
                      <FormControlLabel
                        value={fitnessFunction.id}
                        control={<Radio />}
                        label={fitnessFunction.name}
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
                      //isFloatingPoint={true}
                      isFloatingPoint={parameter.isFloatingPoint}
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
    const newParamV = parametersValues.filter((a) => a); //deletes empty values
    console.log(newParamV);
    try {
      const response = await axios.post(
        "https://metaheuristicalgorithmstesterapi20240102183449.azurewebsites.net/AlgorithmTester/TestSingleAlgorithm",
        {
          // algorithmId: parseInt(selectedAlgorithm),
          // parameters: parametersValues.flat(0),
          // fitnessFunctionID: parseInt(selectedFitnessFunction),
          algorithmId: selectedAlgorithm,
          parameters: newParamV,
          fitnessFunctionID: selectedFitnessFunction,
          // algorithmId: 9,
          // parameters: [10, 0.5, 0.4, 0.4, 74, 6],
          // fitnessFunctionID: 5,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response);
      setRequestResult({
        fBest: response.data.fBest,
        xBest: response.data.xBest,
      });
    } catch (error) {
      console.log(error);
    }
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
              <CardContent>
                <Typography variant="h5" component="div">
                  Result
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {RequestResult.fBest ? "fBest: " + RequestResult.fBest : null}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {RequestResult.fBest
                    ? "xBest: [" + RequestResult.xBest + "]"
                    : null}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default TestSingleAlgorithm;
