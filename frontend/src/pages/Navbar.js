import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [value, setValue] = React.useState(0);

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
      default:
        setValue(0);
        break;
    }
  }, [location]);
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
        </Tabs>
      </Box>
    </Box>
  );
}
