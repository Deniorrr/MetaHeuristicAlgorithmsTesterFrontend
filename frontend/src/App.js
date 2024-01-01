import React, { useState, useEffect } from "react";
import api from "./components/apiConfig";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";

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
  const theme = useTheme();

  const fetchAlgorithms = async () => {
    api
      .get("http://localhost:3001/api/get")
      .then((response) => {
        setAlgorithms(response.data);
      })
      .catch((error) => {
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
              {algorithms.map((algorithm) => {
                return (
                  <FormControlLabel
                    value={algorithm.id}
                    control={<Radio />}
                    label={algorithm.name}
                  />
                );
              })}
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

  const sendRequest = async () => {
    await api
      .post("http://localhost:3001/api/insert", {
        name: "a4",
      })
      .catch((error) => {
        console.log(error);
      })
      .then((response) => {
        console.log(response);
      });
  };
  useEffect(() => {
    fetchAlgorithms();
    fetchFitnessFunction();
  }, []);

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
              <Grid item xs={12}>
                <Button variant="outlined" onClick={sendRequest} size="large">
                  Send
                </Button>
              </Grid>
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
