import { Avatar, Paper } from "@mui/material";
import { memo } from "react";

import CustomModal from "../../../common/CustomModal";

import Slider from "react-slick";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../common/slick/slick-thumb.css";

import "./PhotoViewModal.css";

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
    infinite: false,
    lazyLoad: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: initialIndex,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  console.log(photos);

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      width="92svw"
      height="85svh"
      alignItems="normal"
      // aria-labelledby="modal-modal-title"
      // aria-describedby="modal-modal-description"
    >
      <Slider {...settings}>
        {Object.values(photos).map((photo) => (
          <img
            key={photo}
            alt="church"
            src={`https://imagedelivery.net/ICo2WI8PXO_BVRlWfwzOww/${photo}/MeditationON`}
          />
        ))}
      </Slider>
    </CustomModal>
  );
};

export default PhotoViewModal;
