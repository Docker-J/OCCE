import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useSmallGroupReportContext } from "./SmallGroupReportContext";

const GardenSelector = ({
  gardens: gardensProp,
  selectedGarden: selectedGardenProp,
  handleGardenChange: handleGardenChangeProp,
  color = "#dc2626",
}) => {
  const ctx = useSmallGroupReportContext();
  const gardens = gardensProp ?? ctx?.state?.gardens ?? {};
  const selectedGarden = selectedGardenProp ?? ctx?.state?.selectedGarden;
  const handleGardenChange =
    handleGardenChangeProp ?? ctx?.actions?.handleGardenChange;

  const gardenNames = Object.keys(gardens);

  if (gardenNames.length > 1) {
    return (
      <FormControl fullWidth>
        <InputLabel id="select-garden-label">정원 선택</InputLabel>
        <Select
          labelId="select-garden-label"
          value={selectedGarden}
          label="정원 선택"
          onChange={(e) => handleGardenChange?.(e.target.value)}
        >
          {gardenNames.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <Box
      sx={{
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
        p: "16.5px 14px",
        backgroundColor: "rgba(0, 0, 0, 0.02)",
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 600, color }}>
        정원: {selectedGarden}
      </Typography>
    </Box>
  );
};

export default GardenSelector;
