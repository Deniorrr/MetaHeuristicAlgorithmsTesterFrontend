import React, { useState, useEffect } from "react";
import api from "../components/apiConfig";
import axios from "axios";
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
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Card,
  Grid,
  CardContent,
  Container,
  CssBaseline,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import InputSlider from "../components/InputSlider";

function TestMultipleAlgorithms(props) {
  const [selectedFitnessFunction, setSelectedFitnessFunction] = useState(null);
  const [parameters, setParameters] = useState([]);
  const [parametersValues, setParametersValues] = useState([]);
  const theme = useTheme();
  const [algorithms, setAlgorithms] = useState([]);
  const [fitnessFunctions, setFitnessFunctions] = useState([]);
  const [RequestResult, setRequestResult] = useState({});

  const [open, setOpen] = useState(false);
  const [algorithmOpen, setAlgorithmOpen] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState(null);
  const [selectedFFObject, setSelectedFFObject] = useState({});

  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);

  const openDeleteDialog = (id) => {
    setToBeDeleted(id);
    setOpen(true);
  };

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

  useEffect(() => {
    if (fitnessFunctions.fitnessFunctions)
      setSelectedFFObject(
        fitnessFunctions.fitnessFunctions.find(
          (fitnessFunction) =>
            fitnessFunction.id === parseInt(selectedFitnessFunction, 10)
        )
      );
  }, [selectedFitnessFunction]);

  const initializeParametersValues = (parameters, id) => {
    const params = [];
    parameters.forEach((parameter) => {
      params[parameter.id] = parameter.lowerBoundary;
    });
    const paramsObj = { params: params, id: id };
    setParametersValues([...parametersValues, paramsObj]);
  };

  useEffect(() => {
    setAlgorithms(props.algorithms);
    setFitnessFunctions(props.ffunctions);
  }, [props.algorithms, props.ffunctions]);

  const handleAlgorithmChange = (id, checked) => {
    if (checked) {
      setSelectedAlgorithms([...selectedAlgorithms, id]);
      const theAlg = algorithms.algorithms.find((a) => a.id === id);
      initializeParametersValues(theAlg.parameters, id);
    } else {
      setSelectedAlgorithms(
        selectedAlgorithms.filter((algorithm) => algorithm !== id)
      );
    }
  };

  const changeParameterValue = (index, value, algorithmId) => {
    const newParametersValues = parametersValues.map((paramObj) => {
      if (paramObj.id === algorithmId) {
        return {
          ...paramObj,
          params: {
            ...paramObj.params,
            [index]: value,
          },
        };
      } else {
        return paramObj;
      }
    });

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

  // useEffect(() => {
  //   if (selectedAlgorithm) {
  //     const selected = algorithms.algorithms.find(
  //       (algorithm) => algorithm.id === parseInt(selectedAlgorithm, 10)
  //     );
  //     setParameters([selected.parameters]);
  //     initializeParametersValues(selected.parameters);
  //   }
  // }, [selectedAlgorithm]);

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
            <FormGroup>
              {algorithms.algorithms && Array.isArray(algorithms.algorithms)
                ? algorithms.algorithms.map((algorithm) => {
                    return (
                      <Tooltip
                        title={algorithm.description}
                        placement="right"
                        arrow
                        key={algorithm.id}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedAlgorithms.includes(
                                algorithm.id
                              )}
                              onChange={(event) => {
                                handleAlgorithmChange(
                                  algorithm.id,
                                  event.target.checked
                                );
                              }}
                            />
                          }
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
            </FormGroup>
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
                        key={fitnessFunction.id}
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

  const renderParameters = (id) => {
    //find algorithm with id
    const foundAlgorithm = algorithms.algorithms.find(
      (algorithm) => algorithm.id === id
    );
    // if (parameters.length === 0) return null;
    return (
      <>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              {foundAlgorithm.parameters.map((parameter) => (
                <Tooltip
                  title={parameter.description}
                  placement="right"
                  arrow
                  key={parameter.id}
                >
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    key={parameter.name}
                  >
                    <Grid item xs={12}>
                      <InputSlider
                        changeParameterValue={(_id, _value) =>
                          changeParameterValue(_id, _value, id)
                        }
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
        <Grid item xs={12}></Grid>
      </>
    );
  };

  const sendRequest = async () => {
    console.log(selectedAlgorithms);
    console.log(selectedFitnessFunction);
    console.log(parametersValues);
    if (!selectedFitnessFunction)
      return props.addAlert("error", "Select a fitness function");
    // const newParamV = parametersValues.filter((a) => a); //deletes empty values
    // console.log(newParamV);
    // try {
    //   const response = await axios.post(
    //     "https://metaheuristicalgorithmstesterapi20240102183449.azurewebsites.net/AlgorithmTester/TestSingleAlgorithm",
    //     {
    //       algorithmId: selectedAlgorithms,
    //       parameters: newParamV,
    //       fitnessFunctionID: selectedFitnessFunction,
    //     },
    //     { headers: { "Content-Type": "application/json" } }
    //   );
    //   console.log(response);
    //   setRequestResult({
    //     fBest: response.data.fBest,
    //     xBest: response.data.xBest,
    //   });
    // } catch (error) {
    //   if (error.response.data.message)
    //     return props.addAlert("error", error.response.data.message);
    //   return props.addAlert("error", "Something went wrong");
    // }
  };

  return (
    <Container style={{ marginTop: theme.spacing(2) }}>
      <Grid container spacing={2}>
        <Grid item xs={4} className="aside">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {renderAlgorithms()}
            </Grid>
            <Grid item xs={12}>
              {renderFitnessFunctions()}
            </Grid>
            {selectedAlgorithms.map((algorithm) => {
              const selected = algorithms.algorithms.find(
                (a) => a.id === algorithm
              );
              return (
                <Grid item xs={12} key={algorithm}>
                  <Card>
                    <CardContent>
                      <Typography variant="body1" component="div">
                        {selected.name} parameters:
                      </Typography>
                      {renderParameters(selected.id)}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
            {selectedAlgorithms.length > 0 ? (
              <Grid item xs={12}>
                <Button variant="outlined" onClick={sendRequest} size="large">
                  Send
                </Button>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
        <Grid item xs={8}>
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

export default TestMultipleAlgorithms;
