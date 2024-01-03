import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";

const Input = styled(MuiInput)`
  width: 72px;
`;

export default function InputSlider(props) {
  const minValue = props.minValue;
  const maxValue = props.maxValue;
  const id = props.id;
  const step = props.isFloatingPoint ? (maxValue - minValue) / 100 : 1;
  const [value, setValue] = React.useState(props.minValue);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    props.changeParameterValue(id, newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? minValue : Number(event.target.value));
    props.changeParameterValue(id, event.target.value);
  };

  const handleBlur = () => {
    if (value < minValue) {
      setValue(minValue);
      props.changeParameterValue(id, minValue);
    } else if (value > maxValue) {
      setValue(maxValue);
      props.changeParameterValue(id, maxValue);
    }
  };

  return (
    <Box sx={{ width: 250 }}>
      <Typography id="input-slider" gutterBottom>
        {props.name}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={typeof value === "number" ? value : minValue}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={minValue}
            max={maxValue}
            step={step}
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              min: minValue,
              max: maxValue,
              type: "number",
              "aria-labelledby": "input-slider",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
