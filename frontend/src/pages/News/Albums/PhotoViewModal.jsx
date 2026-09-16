import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Avatar, Paper } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CustomModal from "../../../common/CustomModal";
import "./PhotoViewModal.css";

const PhotoViewModal = ({ isOpen, onClose, photos, initialIndex = 0 }) => {
  const photoList = React.useMemo(() => {
    return photos ? Object.values(photos) : [];
  }, [photos]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: initialIndex || 0,
    loop: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(initialIndex || 0);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback((api) => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
    setPrevDisabled(!api.canScrollPrev());
    setNextDisabled(!api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi && initialIndex != null) {
      emblaApi.scrollTo(initialIndex, true);
    }
  }, [emblaApi, initialIndex]);

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      sx={{
        width: "92svw",
        height: "85svh",
        alignItems: "normal",
        display: "flex",
        flexDirection: "column",
        p: { xs: 1, sm: 2 },
        position: "relative",
      }}
    >
      <div className="photo-modal-main">
        <div className="photo-modal-viewport" ref={emblaRef}>
          <div className="photo-modal-container">
            {photoList.map((photo) => (
              <div className="photo-modal-slide" key={photo}>
                <img
                  loading="lazy"
                  src={`https://imagedelivery.net/ICo2WI8PXO_BVRlWfwzOww/${photo}/MeditationON`}
                  alt="church"
                />
              </div>
            ))}
          </div>
        </div>

        {photoList.length > 1 && (
          <>
            <Avatar
              component={Paper}
              elevation={4}
              sx={{
                position: "absolute",
                top: "50%",
                left: 8,
                transform: "translateY(-50%)",
                zIndex: 4,
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                color: "#1e293b",
                opacity: prevDisabled ? 0.3 : 0.85,
                cursor: prevDisabled ? "default" : "pointer",
                "&:hover": { opacity: 1, backgroundColor: "#fff" },
              }}
              onClick={scrollPrev}
            >
              <NavigateBeforeIcon sx={{ width: 32, height: 32 }} />
            </Avatar>

            <Avatar
              component={Paper}
              elevation={4}
              sx={{
                position: "absolute",
                top: "50%",
                right: 8,
                transform: "translateY(-50%)",
                zIndex: 4,
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                color: "#1e293b",
                opacity: nextDisabled ? 0.3 : 0.85,
                cursor: nextDisabled ? "default" : "pointer",
                "&:hover": { opacity: 1, backgroundColor: "#fff" },
              }}
              onClick={scrollNext}
            >
              <NavigateNextIcon sx={{ width: 32, height: 32 }} />
            </Avatar>
          </>
        )}
      </div>

      {photoList.length > 1 && (
        <div className="photo-modal-thumbs">
          {photoList.map((photo, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                type="button"
                key={photo}
                onClick={() => scrollTo(index)}
                className={`photo-modal-thumb-btn ${isSelected ? "photo-modal-thumb-btn--selected" : ""}`}
              >
                <img
                  loading="lazy"
                  src={`https://imagedelivery.net/ICo2WI8PXO_BVRlWfwzOww/${photo}/MeditationON`}
                  alt={`thumbnail ${index + 1}`}
                />
              </button>
            );
          })}
        </div>
      )}
    </CustomModal>
  );
};

export default PhotoViewModal;
