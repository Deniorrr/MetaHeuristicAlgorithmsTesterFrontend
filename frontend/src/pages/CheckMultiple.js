import React, { useEffect, useState } from "react";
import api from "../components/apiConfig";
import {
  Button,
  TableCell,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  Box,
  Typography,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
} from "@mui/material";

function CheckMultiple(props) {
  const [executedAlgorithms, setExecutedAlgorithms] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  useEffect(() => {
    fetchMultiple();
  }, []);

  const sendContinueRequest = async (id) => {
    api
      .post(
        `/AlgorithmTester/ContinueTestMultipleAlgorithm`,
        { executedId: id },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        props.addAlert("success", "Algorithm has finished succesfully");
        fetchMultiple();
      })
      .catch((error) => {
        props.addAlert("error", "Could not continue algorithm");
      });
  };
  const downloadPdfFile = () => {
    api
      .get(`Reports/PDF/Multiple/${selectedId}`, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `report${selectedId}.pdf`);
        document.body.appendChild(link);
        link.click();
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
      })
      .catch((error) => {
        console.log(error);
        props.addAlert("error", "Could not download file properly");
      });
  };

  const downloadTxtFile = () => {
    api.get(`Reports/TXT/Multiple/${selectedId}`).then((response) => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/txt" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report${selectedId}.txt`);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    });
  };

  const downloadFile = async (id) => {
    api
      .get(`Reports/PDF/Multiple/${id}`, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `report${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
      })
      .catch((error) => {
        console.log(error);
        props.addAlert("error", "Could not download file properly");
      });
  };

  const isTestCompleted = (test) => {
    let isCompleted = true;
    console.log(test);
    test.forEach((ea) => {
      if (ea.isFailed) {
        isCompleted = false;
      }
    });
    return isCompleted;
  };

  const renderAlgorithms = (e, date, uniqueId) => {
    const elements = e.map((ea) => {
      let xBest = "";
      ea.xBest.forEach((x, index) => {
        xBest += `x${index + 1}: ${x} \n`;
      });
      return (
        <TableRow
          key={ea.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell>{ea.testedAlgorithmName}</TableCell>
          <TableCell>{ea.testedFitnessFunctionName}</TableCell>
          <TableCell>{ea.fBest}</TableCell>
          <TableCell>
            <Tooltip
              title={<pre>{xBest}</pre>}
              placement="bottom"
              className="pointer"
              arrow
            >
              {`x1: ${ea.xBest[0]} ...`}
            </Tooltip>
          </TableCell>
          <TableCell>
            {ea.isFailed && ea.timerFrequency !== null ? (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  sendContinueRequest(ea.id);
                }}
              >
                Continue
              </Button>
            ) : null}
          </TableCell>
        </TableRow>
      );
    });
    return (
      <Box marginBottom={2}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell colSpan={5}>
                  <Paper elevation={3}>
                    <Box padding={2}>
                      <Grid container>
                        <Grid item xs={9}>
                          <Typography variant="h5" component="div">
                            <strong>Date:</strong> {date}
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          {isTestCompleted(e) ? (
                            <Button
                              variant="outlined"
                              onClick={() => {
                                setSelectedId(uniqueId);
                                setOpen(true);
                              }}
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
                          <Button
                            variant="outlined"
                            size="large"
                            color="error"
                            style={{
                              marginLeft: "auto",
                              marginTop: "3px",
                              display: "flex",
                              justifyContent: "center",
                            }}
                            onClick={() => {
                              setSelectedDeleteId(uniqueId);
                              setOpenDelete(true);
                            }}
                          >
                            Delete test
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Paper>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>testedAlgorithmName</TableCell>
                <TableCell>testedFitnessFunction</TableCell>
                <TableCell>fBest</TableCell>
                <TableCell>xBest</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{elements}</TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const DeleteRecord = async () => {
    api
      .delete(`/executedMultipleAlgorithms/${selectedDeleteId}`)
      .then((response) => {
        props.addAlert("success", response.data);
        fetchMultiple();
        setOpenDelete(false);
      })
      .catch((error) => {
        props.addAlert("error", error.response.data);
      });
  };

  const renderTests = () => {
    const elements = executedAlgorithms.map((e) => {
      return (
        <>
          {renderAlgorithms(
            e.executedMultipleAlgorithms,
            e.date,
            e.multipleTestId
          )}
        </>
      );
    });
    return elements;
  };

  const fetchMultiple = async () => {
    try {
      const response = await api.get("/executedMultipleAlgorithms");
      setExecutedAlgorithms(response.data);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Multiple Algorithms</h1>
      {renderTests()}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Download report</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Select file format to download
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              downloadPdfFile();
            }}
            color="primary"
          >
            .PDF
          </Button>
          <Button
            onClick={() => {
              downloadTxtFile();
            }}
            color="primary"
            autoFocus
          >
            .TXT
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete test</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this test?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => DeleteRecord()} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CheckMultiple;
