import React, { useState, useEffect } from "react";
import api from "../components/apiConfig";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import {
  Tooltip,
  IconButton,
  Box,
  TextField,
  Dialog,
  Divider,
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
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  Paper,
  TableHead,
  Table,
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
  const [safeModeInterval, setSafeModeInterval] = useState(1000); //in miliseconds

  const [open, setOpen] = useState(false);
  const [algorithmOpen, setAlgorithmOpen] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState(null);
  const [selectedFFObject, setSelectedFFObject] = useState({});

  const [dimension, setDimension] = useState(10);
  const [depth, setDepth] = useState(10);
  const [satisfiedResult, setSatisfiedResult] = useState(0.1);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);

  const [safeMode, setSafeMode] = useState(false);
  const [intervalValue, setIntervalValue] = useState(1000);

  const handleSafeModeChange = (event) => {
    setSafeMode(event.target.checked);
  };

  const changeIntervalValue = (name, value) => {
    setSafeModeInterval(value);
  };

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
    let foundFF;
    console.log(foundFF);
    if (fitnessFunctions.fitnessFunctions) {
      foundFF = fitnessFunctions.fitnessFunctions.find(
        (fitnessFunction) =>
          fitnessFunction.id === parseInt(selectedFitnessFunction, 10)
      );
      if (foundFF) {
        setSelectedFFObject(foundFF);
        if (foundFF.numberOfParameters !== 0)
          setDimension(foundFF.numberOfParameters);
      }
    }
  }, [selectedFitnessFunction]);

  // const initializeParametersValues = (parameters, id) => {
  //   const params = [];
  //   parameters.forEach((parameter) => {
  //     params[parameter.id] = parameter.lowerBoundary;
  //   });
  //   const paramsObj = { params: params, id: id };
  //   setParametersValues([...parametersValues, paramsObj]);
  // };

  useEffect(() => {
    setAlgorithms(props.algorithms);
    setFitnessFunctions(props.ffunctions);
  }, [props.algorithms, props.ffunctions]);

  const handleAlgorithmChange = (id, checked) => {
    if (checked) {
      setSelectedAlgorithms([...selectedAlgorithms, id]);
      // const theAlg = algorithms.algorithms.find((a) => a.id === id);
      // initializeParametersValues(theAlg.parameters, id);
    } else {
      setSelectedAlgorithms(
        selectedAlgorithms.filter((algorithm) => algorithm !== id)
      );
    }
  };

  // const changeParameterValue = (index, value, algorithmId) => {
  //   const newParametersValues = parametersValues.map((paramObj) => {
  //     if (paramObj.id === algorithmId) {
  //       return {
  //         ...paramObj,
  //         params: {
  //           ...paramObj.params,
  //           [index]: value,
  //         },
  //       };
  //     } else {
  //       return paramObj;
  //     }
  //   });

  //   setParametersValues(newParametersValues);
  // };

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

  // const renderParameters = (id) => {
  //   //find algorithm with id
  //   const foundAlgorithm = algorithms.algorithms.find(
  //     (algorithm) => algorithm.id === id
  //   );
  //   // if (parameters.length === 0) return null;
  //   return (
  //     <>
  //       <Grid item xs={12}>
  //         <Card>
  //           <CardContent>
  //             {foundAlgorithm.parameters.map((parameter) => (
  //               <Tooltip
  //                 title={parameter.description}
  //                 placement="right"
  //                 arrow
  //                 key={parameter.id}
  //               >
  //                 <Grid
  //                   container
  //                   spacing={2}
  //                   alignItems="center"
  //                   key={parameter.name}
  //                 >
  //                   <Grid item xs={12}>
  //                     <InputSlider
  //                       changeParameterValue={(_id, _value) =>
  //                         changeParameterValue(_id, _value, id)
  //                       }
  //                       minValue={parameter.lowerBoundary}
  //                       maxValue={parameter.upperBoundary}
  //                       name={parameter.name}
  //                       id={parameter.id}
  //                       //isFloatingPoint={true}
  //                       isFloatingPoint={parameter.isFloatingPoint}
  //                       selectedFFParametersAmount={
  //                         selectedFFObject.numberOfParameters
  //                       }
  //                     />
  //                   </Grid>
  //                 </Grid>
  //               </Tooltip>
  //             ))}
  //           </CardContent>
  //         </Card>
  //       </Grid>
  //       <Grid item xs={12}></Grid>
  //     </>
  //   );
  // };

  const renderDimension = () => {
    return (
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <FormControl>
              <Tooltip
                title="Dimension of the fitness function"
                placement="right"
                arrow
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12}>
                    <InputSlider
                      changeParameterValue={(_id, _value) =>
                        setDimension(_value)
                      }
                      minValue={2}
                      maxValue={dimension}
                      name={"Dimension"}
                      id={"dimension"}
                      isFloatingPoint={false}
                      selectedFFParametersAmount={
                        selectedFFObject.numberOfParameters
                      }
                    />
                  </Grid>
                </Grid>
              </Tooltip>
              <Tooltip title="Amount of iterations" placement="right" arrow>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12}>
                    <InputSlider
                      changeParameterValue={(_id, _value) => setDepth(_value)}
                      minValue={10}
                      maxValue={100}
                      name={"Depth"}
                      id={"Depth"}
                      isFloatingPoint={false}
                      selectedFFParametersAmount={
                        selectedFFObject.numberOfParameters
                      }
                    />
                  </Grid>
                </Grid>
              </Tooltip>
              <Tooltip
                title="A result that satisfies you"
                placement="right"
                arrow
              >
                <Grid container spacing={2} alignItems="center" marginTop={1}>
                  <Grid item xs={12}>
                    <TextField
                      type="number"
                      inputProps={{ step: Math.pow(10, -3) }}
                      label="Satisfying Result"
                      value={satisfiedResult}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setSatisfiedResult(e.target.value);
                      }}
                    />
                  </Grid>
                </Grid>
              </Tooltip>

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
    );
  };
  const downloadFile = async () => {
    api
      .get(
        `Reports/PDF/Multiple/${RequestResult.executedAlgorithms[0].multipleTestId}`,
        {
          responseType: "arraybuffer",
        }
      )
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `report123.pdf`);
        document.body.appendChild(link);
        link.click();
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
      })
      .catch((error) => {
        console.log(error);
        props.addAlert("error", "Could not download file properly");
      });
  };

  const sendRequest = async () => {
    if (!selectedFitnessFunction)
      return props.addAlert("error", "Select a fitness function");
    const number = Number(satisfiedResult);
    console.log(satisfiedResult);

    // Check if the input is not a number or if it's an integer
    if (isNaN(number) || number % 1 === 0) {
      props.addAlert("error", "Invalid input: not a double");
      return;
    }

    // const params = {
    //   algorithmId: selectedAlgorithm,
    //   parameters: newParamV,
    //   fitnessFunctionID: selectedFitnessFunction,
    // };
    const algorithmsIds = selectedAlgorithms.map((a) => {
      return { id: a };
    });
    const params = {
      algorithms: algorithmsIds,
      fitnessFunctionID: selectedFitnessFunction,
      depth: depth,
      dimension: dimension,
      satisfiedResult: number,
    };
    let endpoint = "AlgorithmTester/TestMultipleAlgorithms";
    if (safeMode) {
      endpoint = "AlgorithmTester/TestMultipleAlgorithmsSafeMode";
      params.interval = safeModeInterval;
    }

    console.log(params);
    try {
      const response = await api.post(
        "AlgorithmTester/TestMultipleAlgorithms",
        params,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response);
      setRequestResult(response.data);
    } catch (error) {
      if (error.response.data.message)
        return props.addAlert("error", error.response.data.message);
      return props.addAlert("error", "Something went wrong");
    }
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

  const renderResultParameters = (_parameters, algId) => {
    const foundAlgorithm = algorithms.algorithms.find(
      (algorithm) => algorithm.id === algId
    );

    const elements = [];
    for (let i = 0; i < _parameters.length; i++) {
      elements.push({
        id: i,
        name: foundAlgorithm.parameters[i].name,
        value: _parameters[i],
      });
    }
    return (
      <Table sx={5} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>
              <Typography variant="h5" component="div" textAlign={"center"}>
                Parameters found
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
  const renderResultValues = (a) => {
    const elements = [];
    elements.push({
      id: 0,
      name: "fBest",
      value: a.fBest,
    });
    for (let i = 0; i < a.xBest.length; i++) {
      elements.push({
        id: i + 1,
        name: "x" + (i + 1),
        value: a.xBest[i],
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
    if (!RequestResult.executedAlgorithms) return;

    console.log(RequestResult.executedAlgorithms);
    const elements = RequestResult.executedAlgorithms.map((a) => {
      return (
        <>
          <Typography
            variant="h5"
            component="div"
            marginBottom={1}
            marginTop={1}
            textAlign={"center"}
          >
            Algorithm: <strong>{a.testedAlgorithmName}</strong>
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5} marginBottom={1}>
              <Paper elevation={6}>
                {renderResultParameters(a.parameters, a.testedAlgorithmId)}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={7} marginBottom={1}>
              <Paper elevation={6}>{renderResultValues(a)}</Paper>
            </Grid>
          </Grid>
          <Divider />
        </>
      );
    });

    return elements;
  };

  return (
    <Container style={{ marginTop: theme.spacing(2) }}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          className="aside"
          boxSizing={"border-box"}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {renderAlgorithms()}
            </Grid>
            <Grid item xs={12}>
              {renderFitnessFunctions()}
            </Grid>
            {renderDimension()}
            {/* {selectedAlgorithms.map((algorithm) => {
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
            })} */}
            {selectedAlgorithms.length > 0 ? (
              <Grid item xs={12}>
                <Button variant="outlined" onClick={sendRequest} size="large">
                  Send
                </Button>
              </Grid>
            ) : null}
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
                {RequestResult.executedAlgorithms ? (
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

              {renderResult()}
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
