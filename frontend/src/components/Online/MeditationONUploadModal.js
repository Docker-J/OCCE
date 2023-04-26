const MeditationONUploadModal = (props) => {
  <Modal
    open={props.openModal}
    onClose={props.handleClose}
    // aria-labelledby="modal-modal-title"
    // aria-describedby="modal-modal-description"
  >
    <Box sx={style} bgcolor="white">
      <Button variant="contained" component="label">
        Upload
        <input
          hidden
          accept="image/*"
          multiple
          type="file"
          onChange={(e) => props.handleChangeFile(e)}
        />
      </Button>

      <Button onClick={uploadFiles} variant="contained" component="label">
        Submit
      </Button>

      {imagesPreview.map((image) => (
        <img src={image} />
      ))}
    </Box>
  </Modal>;
};

export default MeditationONUploadModal;
