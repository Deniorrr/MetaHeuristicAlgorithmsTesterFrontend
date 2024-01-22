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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
} from "@mui/material";

function CheckSingle(props) {
  const [executedAlgorithms, setExecutedAlgorithms] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  useEffect(() => {
    fetchSingles();
  }, []);

  const downloadPdfFile = () => {
    api
      .get(`Reports/PDF/Single/${selectedId}`, {
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
    api.get(`Reports/TXT/Single/${selectedId}`).then((response) => {
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

  const deleteTest = async () => {
    api
      .delete(`ExecutedSingleAlgorithms/${selectedDeleteId}`)
      .then((response) => {
        props.addAlert("success", "Test deleted successfully");
        setOpenDelete(false);
        fetchSingles();
      })
      .catch((error) => {
        props.addAlert("error", "Could not delete test");
      });
  };

  const sendContinueRequest = async (id) => {
    api
      .post(
        `/AlgorithmTester/ContinueTestSingleAlgorithm`,
        { executedId: id },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        props.addAlert("success", "Algorithm has finished succesfully");
        fetchSingles();
      })
      .catch((error) => {
        props.addAlert("error", "Could not continue algorithm");
      });
  };

  const renderAlgorithms = () => {
    const elements = executedAlgorithms.map((ea) => {
      let xBest = "";
      ea.xBest.forEach((x, index) => {
        xBest += `x${index + 1}: ${x} \n`;
      });
      return (
        <TableRow
          key={ea.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell>{ea.date}</TableCell>
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
            {ea.isFailed ? (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  sendContinueRequest(ea.id);
                }}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() => {
                  setSelectedId(ea.id);
                  setOpen(true);
                }}
              >
                Download report
              </Button>
            )}
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setSelectedDeleteId(ea.id);
                setOpenDelete(true);
              }}
              style={{ marginTop: "3px" }}
            >
              Delete
            </Button>
          </TableCell>
        </TableRow>
      );
    });
    // const elements = executedAlgorithms.map((ea) => {
    //   return (
    //     <TableRow
    //       key={ea.id}
    //       sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    //     >
    //       <TableCell>{ea.testedAlgorithmName}</TableCell>
    //       <TableCell>{ea.testedFitnessFunctionName}</TableCell>
    //       <TableCell>{ea.date}</TableCell>
    //       <TableCell>{ea.isFailed ? "true" : "false"}</TableCell>
    //       <TableCell>
    //         {ea.isFailed ? (
    //           <Button
    //             variant="outlined"
    //             color="secondary"
    //             onClick={() => {
    //               sendContinueRequest(ea.id);
    //             }}
    //           >
    //             Continue
    //           </Button>
    //         ) : (
    //           <Button
    //             variant="outlined"
    //             onClick={() => {
    //               setSelectedId(ea.id);
    //               setOpen(true);
    //             }}
    //           >
    //             Download report
    //           </Button>
    //         )}
    //         <Button
    //           variant="outlined"
    //           color="error"
    //           onClick={() => {
    //             setSelectedDeleteId(ea.id);
    //             setOpenDelete(true);
    //           }}
    //         >
    //           Delete
    //         </Button>
    //       </TableCell>
    //     </TableRow>
    //   );
    // });
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
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
    );
  };

  const fetchSingles = async () => {
    try {
      const response = await api.get("/executedSingleAlgorithms");
      setExecutedAlgorithms(response.data.executedAlgorithms);
      console.log(response.data.executedAlgorithms);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Single Algorithms</h1>
      {renderAlgorithms()}
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
          <Button onClick={() => deleteTest()} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CheckSingle;
