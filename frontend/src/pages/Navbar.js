import React, { useEffect } from "react";
import {
  Tabs,
  Tab,
  Box,
  IconButton,
  Grid,
  Button,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import green from "@mui/material/colors/green";
import HelpIcon from "@mui/icons-material/Help";
import DownloadIcon from "@mui/icons-material/Download";
import api from "../components/apiConfig";

const defaultTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const greenTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: green[500],
    },
  },
});

export default function Navbar() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const downloadInstruction = () => {
    api
      .get(`Instruction/GetInstructionPDF`, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `instruction.pdf`);
        document.body.appendChild(link);
        link.click();
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
      });
  };
  const downloadDll = () => {
    api
      .get(`Instruction/GetDllFile`, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/dll" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `dllTemplate.dll`);
        document.body.appendChild(link);
        link.click();
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
      });
  };
  useEffect(() => {
    switch (location.pathname) {
      case "/MetaHeuristicAlgorithmsTesterFrontend/":
        setValue(0);
        break;
      case "/MetaHeuristicAlgorithmsTesterFrontend/testMultiple":
        setValue(1);
        break;
      case "/MetaHeuristicAlgorithmsTesterFrontend/addAlgorithm":
        setValue(2);
        break;
      case "/MetaHeuristicAlgorithmsTesterFrontend/addFitnessFunction":
        setValue(3);
        break;
      case "/MetaHeuristicAlgorithmsTesterFrontend/checkSingleStatus":
        setValue(4);
        break;
      case "/MetaHeuristicAlgorithmsTesterFrontend/checkMultipleStatus":
        setValue(5);
        break;
      default:
        navigate("/MetaHeuristicAlgorithmsTesterFrontend/");
        setValue(0);
        break;
    }
  }, [location, navigate]);
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Grid container justifyContent="flex-end">
          <Grid item xs={10}>
            <ThemeProvider theme={value === 3 ? greenTheme : defaultTheme}>
              <Tabs value={value} aria-label="basic tabs example">
                <Tab
                  label="Test single function"
                  component={NavLink}
                  to="/MetaHeuristicAlgorithmsTesterFrontend/"
                />
                <Tab
                  label="Test multiple functions"
                  component={NavLink}
                  to="/MetaHeuristicAlgorithmsTesterFrontend/testMultiple"
                />
                <Tab
                  label="Add Algorithm"
                  component={NavLink}
                  to="/MetaHeuristicAlgorithmsTesterFrontend/addAlgorithm"
                />
                <Tab
                  label="Add Fitness Function"
                  component={NavLink}
                  to="/MetaHeuristicAlgorithmsTesterFrontend/addFitnessFunction"
                />
                <Tab
                  label="Check Single test status"
                  component={NavLink}
                  to="/MetaHeuristicAlgorithmsTesterFrontend/checkSingleStatus"
                />
                <Tab
                  label="Check multiple test status"
                  component={NavLink}
                  to="/MetaHeuristicAlgorithmsTesterFrontend/checkMultipleStatus"
                />
              </Tabs>
            </ThemeProvider>
          </Grid>
          <Grid item xs={2}>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <Tooltip title="Download the instruction PDF flie" arrow>
                <IconButton
                  color="primary"
                  onClick={() => downloadInstruction()}
                >
                  <HelpIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download the .dll template" arrow>
                <IconButton color="primary" onClick={() => downloadDll()}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
