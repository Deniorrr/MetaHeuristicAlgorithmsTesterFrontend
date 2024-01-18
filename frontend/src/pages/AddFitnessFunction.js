import React, { useState } from "react";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import green from "@mui/material/colors/green";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  FormHelperText,
} from "@mui/material";
import api from "../components/apiConfig";
import { Theme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: green[500],
    },
  },
});

function AddFitnessFunction(props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!selectedFile) newErrors.file = "File is required";
    else if (!selectedFile.name.endsWith(".dll"))
      newErrors.file = "File must be a .dll file";

    setErrors(newErrors);

    if (Object.keys(newErrors).length == !0) {
      return;
    }

    api
      .post(
        "FitnessFunction",
        {
          Name: name,
          Description: description,
          DllFile: selectedFile,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log(response);
        props.addFitnessFunction(response.data.fitnessFunction);
        props.addAlert("success", response.data.message);
      })
      .catch((e) => {
        console.log(e);
        props.addAlert("error", e.response.data.message);
      });
    console.log("Name:", name);
    console.log("Description:", description);
    console.log("Selected File:", selectedFile);
  };

  return (
    <Container style={{ marginTop: theme.spacing(2) }}>
      <ThemeProvider theme={theme}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Add Fitness Function
                </Typography>
                <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                  <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    error={!!errors.description}
                    helperText={errors.description}
                    fullWidth
                    margin="normal"
                  />
                  <Box display="flex" alignItems="center" marginY={2}>
                    <Button variant="contained" component="label">
                      Select DLL file
                      <input type="file" hidden onChange={handleFileSelect} />
                    </Button>
                    {selectedFile && (
                      <Typography
                        variant="body1"
                        style={{ marginLeft: theme.spacing(2) }}
                      >
                        {selectedFile.name}
                      </Typography>
                    )}
                  </Box>
                  {errors.file && (
                    <FormHelperText error>{errors.file}</FormHelperText>
                  )}
                  <Button
                    sx={{ marginTop: theme.spacing(2) }}
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Add Fitness Function
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </ThemeProvider>
    </Container>
  );
}

export default AddFitnessFunction;
