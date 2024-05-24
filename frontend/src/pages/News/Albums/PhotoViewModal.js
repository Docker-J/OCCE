import { Avatar, Box, Modal, Paper } from "@mui/material";
import { memo, useState } from "react";

import Slider from "react-slick";

import CloseIcon from "@mui/icons-material/Close";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../../../common/slick/slick-thumb.css";
import "./PhotoViewModal.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90svw",
  height: "85svh",
  bgcolor: "#ffffff",
  boxShadow: 24,
  borderRadius: "0.5em",
  p: 1,
  py: 5,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const PrevArrow = memo(({ onClick }) => {
  return (
    <Avatar
      component={Paper}
      elevation={5}
      sx={{
        position: "absolute",
        top: "50%",
        left: 10,
        opacity: 0.7,
        zIndex: 2,
        backgroundColor: "white",
        color: "black",
      }}
      onClick={onClick}
    >
      <NavigateBeforeIcon
        sx={{
          width: 32,
          height: 32,
        }}
      />
    </Avatar>
  );
});

const NextArrow = memo(({ onClick }) => {
  return (
    <Avatar
      component={Paper}
      elevation={5}
      sx={{
        position: "absolute",
        top: "50%",
        right: 10,
        opacity: 0.7,
        zIndex: 2,
        backgroundColor: "white",
        color: "black",
      }}
      onClick={onClick}
    >
      <NavigateNextIcon
        sx={{
          width: 32,
          height: 32,
        }}
      />
    </Avatar>
  );
});

const PhotoViewModal = ({ isOpen, onClose, photos, initialIndex }) => {
  const handleClose = () => {
    onClose();
  };

  const [index, setIndex] = useState(initialIndex);

  const settings = {
    customPaging: (i) => {
      return (
        <img
          alt=""
          src={`https://imagedelivery.net/ICo2WI8PXO_BVRlWfwzOww/${
            Object.values(photos)[i]
          }/MeditationON`}
        />
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    lazyLoad: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // centerMode: true,
    // variableWidth: true,
    initialSlide: initialIndex,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      // aria-labelledby="modal-modal-title"
      // aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div>
          <Slider {...settings}>
            {Object.values(photos).map((photo) => (
              <div className="img-container" key={photo}>
                <img
                  style={{ objectFit: "contain !important" }}
                  alt="church"
                  src={`https://imagedelivery.net/ICo2WI8PXO_BVRlWfwzOww/${photo}/MeditationON`}
                />
              </div>
            ))}
          </Slider>
        </div>

        <CloseIcon
          onClick={handleClose}
          sx={{ position: "absolute", top: 12, right: 12 }}
        />
      </Box>
    </Modal>
  );
};

export default PhotoViewModal;
