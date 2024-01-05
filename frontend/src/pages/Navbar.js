import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate("/");
        break;
      case 1:
        navigate("/testMultiple");
        break;
      case 2:
        navigate("/addAlgorithm");
        break;
    }
  };

  useEffect(() => {
    switch (window.location.pathname) {
      case "/":
        setValue(0);
        break;
      case "/testMultiple":
        setValue(1);
        break;
      case "/addAlgorithm":
        setValue(2);
        break;
    }
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Test single function" />
          <Tab label="Test multiple functions" />
          <Tab label="Add Algorithm" />
        </Tabs>
      </Box>
    </Box>
  );
}
