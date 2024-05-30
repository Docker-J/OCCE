import { Box, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useDropzone } from "react-dropzone";

const FileUploadComponent = ({ handleChangeFile, multiple }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [],
    },
    onDrop: (acceptedFile) => {
      handleChangeFile(acceptedFile);
    },
    multiple: multiple,
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        border: "1pt dotted #f57c00",
        borderRadius: "1em",
        overflowY: "auto",
        marginBottom: "1em",
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Box
        sx={{
          position: "relative",
          height: "100%",
          widht: "100%",
        }}
      >
        <div
          style={{
            width: "100%",

            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <AddCircleOutlineIcon fontSize="large" color="primary" />
          <Typography>Click or Drag File to here</Typography>
        </div>
      </Box>
    </div>
  );
};

export default FileUploadComponent;
