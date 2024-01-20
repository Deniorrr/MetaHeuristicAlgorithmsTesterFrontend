import React, { useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import green from "@mui/material/colors/green";

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
      </Box>
    </Box>
  );
}
