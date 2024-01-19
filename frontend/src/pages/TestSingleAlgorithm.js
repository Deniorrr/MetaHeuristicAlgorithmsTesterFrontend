import React, { useState, useEffect } from "react";
import api from "../components/apiConfig";
import { useTheme } from "@mui/material/styles";
import {
  Tooltip,
  IconButton,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Card,
  Grid,
  CardContent,
  Container,
  CssBaseline,
  Typography,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import InputSlider from "../components/InputSlider";

function TestSingleAlgorithm(props) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [selectedFitnessFunction, setSelectedFitnessFunction] = useState(null);
  const [parameters, setParameters] = useState([]);
  const [parametersValues, setParametersValues] = useState({});
  const theme = useTheme();
  const [algorithms, setAlgorithms] = useState([]);
  const [fitnessFunctions, setFitnessFunctions] = useState([]);
  const [RequestResult, setRequestResult] = useState({});
  const [safeMode, setSafeMode] = useState(false);
  const [selectedFFObject, setSelectedFFObject] = useState({});

  const [open, setOpen] = useState(false);
  const [algorithmOpen, setAlgorithmOpen] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState(null);

  const openDeleteDialog = (id) => {
    setToBeDeleted(id);
    setOpen(true);
  };
  const handleSafeModeChange = (event) => {
    setSafeMode(event.target.checked);
  };

  useEffect(() => {
    if (fitnessFunctions.fitnessFunctions)
      setSelectedFFObject(
        fitnessFunctions.fitnessFunctions.find(
          (fitnessFunction) =>
            fitnessFunction.id === parseInt(selectedFitnessFunction, 10)
        )
      );
  }, [selectedFitnessFunction]);
  const closeDeleteDialog = () => {
    setOpen(false);
  };

  const openAlgorithmDeleteDialog = (id) => {
    setToBeDeleted(id);
    setAlgorithmOpen(true);
  };

  const closeAlgorithmDeleteDialog = () => {
    setAlgorithmOpen(false);
  };

  const initializeParametersValues = (parameters) => {
    const parametersValues = [];
    parameters.forEach((parameter) => {
      parametersValues[parameter.id] = parameter.lowerBoundary;
    });
    setParametersValues(parametersValues);
  };

  const downloadFile = async () => {
    api
      .get(`Reports/PDF/${RequestResult.executedTestId}`)
      .then((response) => {
        console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `report${RequestResult.executedTestId}.pdf`
        );
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        props.addAlert("error", "Could not download file properly");
      });
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

  const deleteFitnessFunction = async () => {
    props.deleteFitnessFunction(toBeDeleted);
    closeDeleteDialog();
  };

  const deleteAlgorithm = async () => {
    props.deleteAlgorithm(toBeDeleted);
    closeAlgorithmDeleteDialog();
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
                      <Tooltip
                        title={algorithm.description}
                        placement="right"
                        arrow
                      >
                        <FormControlLabel
                          value={algorithm.id}
                          control={<Radio />}
                          label={
                            <Box display="flex" alignItems="center">
                              <Typography>{algorithm.name}</Typography>
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() =>
                                  openAlgorithmDeleteDialog(algorithm.id)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          }
                        />
                      </Tooltip>
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
                      <Tooltip
                        title={fitnessFunction.description}
                        placement="right"
                        arrow
                      >
                        <FormControlLabel
                          value={fitnessFunction.id}
                          control={<Radio />}
                          label={
                            <Box display="flex" alignItems="center">
                              <Typography>{fitnessFunction.name}</Typography>
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() =>
                                  openDeleteDialog(fitnessFunction.id)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          }
                        />
                      </Tooltip>
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
                <Tooltip title={parameter.description} placement="right" arrow>
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
                        selectedFFParametersAmount={
                          selectedFFObject.numberOfParameters
                        }
                      />
                    </Grid>
                  </Grid>
                </Tooltip>
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
    if (!selectedAlgorithm)
      return props.addAlert("error", "Select an algorithm");
    if (!selectedFitnessFunction)
      return props.addAlert("error", "Select a fitness function");

    const newParamV = parametersValues.filter((a) => a); //deletes empty values

    console.log(newParamV);
    let endpoint = "AlgorithmTester/TestSingleAlgorithm";
    if (safeMode) endpoint = "AlgorithmTester/TestSingleAlgorithmSafeMode";

    try {
      const response = await api.post(
        endpoint,
        {
          algorithmId: selectedAlgorithm,
          parameters: newParamV,
          fitnessFunctionID: selectedFitnessFunction,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response);
      setRequestResult(response.data);
    } catch (error) {
      if (error.response.data.message)
        return props.addAlert("error", error.response.data.message);
      return props.addAlert("error", "Something went wrong");
    }
  };

  const renderResult = () => {
    return (
      <>
        <Grid item xs={12}>
          <Typography variant="h6" component="div">
            fBest: {RequestResult.fBest}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" component="div">
            xBest: {RequestResult.xBest}
          </Typography>
          <Button variant="outlined" onClick={downloadFile} size="large">
            Download Report
          </Button>
        </Grid>
      </>
    );
  };

  return (
    <Container style={{ marginTop: theme.spacing(2) }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3} className="aside">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {renderAlgorithms()}
            </Grid>
            <Grid item xs={12}>
              {renderFitnessFunctions()}
            </Grid>

            {renderParameters()}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <FormControl>
                    <FormLabel>Options</FormLabel>
                    <Tooltip
                      title="Safe mode activates a mechanism, that prevents from loosing data "
                      placement="right"
                      arrow
                    >
                      <FormControlLabel
                        control={<Checkbox onChange={handleSafeModeChange} />}
                        label="Safe Mode"
                      />
                    </Tooltip>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={9}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Result
              </Typography>
              {RequestResult.fBest ? renderResult() : null}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog
        open={algorithmOpen}
        onClose={closeAlgorithmDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Algorithm"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this algorithm?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAlgorithmDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteAlgorithm} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Fitness Function"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this fitness function?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteFitnessFunction} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default TestSingleAlgorithm;
