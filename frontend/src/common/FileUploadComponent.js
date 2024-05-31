import { Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useDropzone } from "react-dropzone";

const FileUploadComponent = ({ accept, handleChangeFile, multiple }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept,
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
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AddCircleOutlineIcon fontSize="large" color="primary" />
        <Typography>Click or Drag File to here</Typography>
      </div>
    </div>
  );
};

export default FileUploadComponent;
