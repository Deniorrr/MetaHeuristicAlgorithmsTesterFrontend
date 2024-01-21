import React from "react";

function renderAlgorithms() {
  const renderAlgorithms = (e) => {
    const elements = e.map((ea) => {
      return (
        <TableRow
          key={ea.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell>{ea.testedAlgorithmName}</TableCell>
          <TableCell>{ea.testedFitnessFunctionName}</TableCell>
          <TableCell>{ea.date}</TableCell>
          <TableCell>{ea.isFailed ? "true" : "false"}</TableCell>
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
                  downloadFile(ea.id);
                }}
              >
                Download report
              </Button>
            )}
          </TableCell>
        </TableRow>
      );
    });
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>testedAlgorithmName</TableCell>
              <TableCell>testedFitnessFunction</TableCell>
              <TableCell>date</TableCell>
              <TableCell>Is failed?</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{elements}</TableBody>
        </Table>
      </TableContainer>
    );
  };

  return <>{renderAlgorithms()}</>;
}

export default renderAlgorithms;
