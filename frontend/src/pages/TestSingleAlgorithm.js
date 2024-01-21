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
  Divider,
  Grid,
  CardContent,
  Container,
  CssBaseline,
  Typography,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
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
  const [safeModeInterval, setSafeModeInterval] = useState(1000); //in miliseconds

  const [savedParameters, setSavedParameters] = useState([]);
  const [savedParametersValues, setSavedParametersValues] = useState([]);

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
      .get(`Reports/PDF/Single/${RequestResult.executedTestId}`, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `report${RequestResult.executedTestId}.pdf`
        );
        document.body.appendChild(link);
        link.click();
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
      })
      .catch((error) => {
        console.log(error);
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

  const changeIntervalValue = (name, value) => {
    setSafeModeInterval(value);
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
                        key={algorithm.id}
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

  const renderParameters = () => {
    if (parameters.length === 0) return null;
    return (
      <>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              {parameters[0].map((parameter) => (
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

    const params = {
      algorithmId: selectedAlgorithm,
      parameters: newParamV,
      fitnessFunctionID: selectedFitnessFunction,
    };
    if (safeMode) {
      endpoint = "AlgorithmTester/TestSingleAlgorithmSafeMode";
      params.timerFrequency = safeModeInterval;
      console.log("safe mode", safeModeInterval);
    }

    try {
      const response = await api.post(endpoint, params, {
        headers: { "Content-Type": "application/json" },
      });
      setSavedParameters(parameters);
      setSavedParametersValues(newParamV);
      console.log(response);
      setRequestResult(response.data);
    } catch (error) {
      if (error.response.data.message)
        return props.addAlert("error", error.response.data.message);
      return props.addAlert("error", "Something went wrong");
    }
  };

  const renderResultParameters = () => {
    const elements = [];
    console.log(savedParameters);
    console.log(savedParametersValues);
    for (let i = 0; i < savedParametersValues.length; i++) {
      elements.push({
        id: i,
        name: savedParameters[0][i].name,
        value: savedParametersValues[i],
      });
    }
    console.log(elements);
    return (
      <Table sx={5} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>
              <Typography variant="h5" component="div" textAlign={"center"}>
                Parameters used
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Parameter name</strong>
            </TableCell>
            <TableCell>
              <strong>Value</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {elements.map((e) => (
            <TableRow
              key={e.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{e.name}</TableCell>
              <TableCell>{e.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
    // return elements.map((element) => {
    //   return (
    //     <Typography variant="body1" component="div">
    //       {element.name}: {element.value}
    //     </Typography>
    //   );
    // });
  };

  const renderResultValues = () => {
    const elements = [];
    elements.push({
      id: 0,
      name: "fBest",
      value: RequestResult.fBest,
    });
    for (let i = 0; i < RequestResult.xBest.length; i++) {
      elements.push({
        id: i + 1,
        name: "x" + (i + 1),
        value: RequestResult.xBest[i],
      });
    }

    return (
      <Table sx={5} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>
              <Typography variant="h5" component="div" textAlign={"center"}>
                Values found
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>Name</strong>
            </TableCell>
            <TableCell>
              <strong>Value</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {elements.map((e) => (
            <TableRow
              key={e.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{e.name}</TableCell>
              <TableCell>{e.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      // <>
      //   <Typography variant="body1" component="div" marginBottom={1}>
      //     fBest: {a.fBest}
      //   </Typography>
      //   {renderXbest(a.xBest)}
      // </>
    );
  };

  const renderResult = () => {
    return (
      <>
        <Typography
          variant="h5"
          component="div"
          marginBottom={1}
          marginTop={1}
          textAlign={"center"}
        >
          Algorithm: <strong>{RequestResult.testedAlgorithmName}</strong>
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5} marginBottom={1}>
            <Paper elevation={6}>{renderResultParameters()}</Paper>
          </Grid>
          <Grid item xs={12} sm={7} marginBottom={1}>
            <Paper elevation={6}>{renderResultValues()}</Paper>
          </Grid>
        </Grid>
        <Divider />
      </>
      // <>
      //   <Grid item xs={12}>
      //     <Typography variant="h6" component="div">
      //       fBest: {RequestResult.fBest}
      //     </Typography>
      //   </Grid>
      //   <Grid item xs={12}>
      //     <Typography variant="h6" component="div">
      //       xBest: {RequestResult.xBest}
      //     </Typography>
      //     <Button variant="outlined" onClick={downloadFile} size="large">
      //       Download Report
      //     </Button>
      //   </Grid>
      // </>
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

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <FormControl>
                    <FormLabel>Options</FormLabel>
                    <Tooltip
                      title="Safe mode activates a mechanism, that prevents from loosing data during testing."
                      placement="right"
                      arrow
                    >
                      <FormControlLabel
                        control={<Checkbox onChange={handleSafeModeChange} />}
                        label="Safe Mode"
                      />
                    </Tooltip>
                    {safeMode ? (
                      <Tooltip
                        title="Interval (in miliseconds) between each Safe Mode save)"
                        placement="right"
                        arrow
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12}>
                            <InputSlider
                              changeParameterValue={changeIntervalValue}
                              minValue={1000}
                              maxValue={10000}
                              name="Interval"
                              id="Interval"
                              isFloatingPoint={false}
                              selectedFFParametersAmount={1}
                            />
                          </Grid>
                        </Grid>
                      </Tooltip>
                    ) : null}
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
            {renderParameters()}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={9}>
          <Card>
            <CardContent>
              <Typography
                variant="h4"
                component="div"
                marginBottom={1}
                textAlign={"center"}
              >
                Result
                {!isNaN(RequestResult.fBest) ? (
                  <Button
                    variant="outlined"
                    onClick={downloadFile}
                    size="large"
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    Download Report
                  </Button>
                ) : null}
              </Typography>
              <Divider />
              {!isNaN(RequestResult.fBest) ? renderResult() : null}
            </CardContent>
          </Card>
          {/* <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Result
              </Typography>
              {RequestResult.fBest ? renderResult() : null}
            </CardContent>
          </Card> */}
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
