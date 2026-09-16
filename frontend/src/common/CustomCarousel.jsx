import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Avatar, Paper } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./CustomCarousel.css";

const CustomCarousel = ({
  children,
  className = "",
  slideClassName = "",
  slideStyle = {},
  slideBasis,
  slideGap,
  showArrows = true,
  showDots = true,
  dotColor,
  autoPlay = false,
  autoPlayInterval = 5000,
  loop = true,
  startIndex = 0,
  options = {},
  plugins = [],
  clickableSlides = false,
  onSlideClick,
  onSelectIndex,
  apiRef,
  fillHeight = false,
  ...props
}) => {
  const autoplayPlugin = React.useMemo(() => {
    if (!autoPlay) return null;
    return Autoplay({
      delay: autoPlayInterval,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    });
  }, [autoPlay, autoPlayInterval]);

  const emblaPlugins = React.useMemo(() => {
    return autoplayPlugin ? [autoplayPlugin, ...plugins] : [...plugins];
  }, [autoplayPlugin, plugins]);

  const emblaOptions = React.useMemo(() => {
    return { loop, startIndex, ...options };
  }, [loop, startIndex, options]);

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions, emblaPlugins);

  const [selectedIndex, setSelectedIndex] = useState(startIndex);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  useEffect(() => {
    if (!emblaApi) return;
    if (typeof apiRef === "function") {
      apiRef(emblaApi);
    } else if (apiRef && typeof apiRef === "object") {
      apiRef.current = emblaApi;
    }
  }, [emblaApi, apiRef]);

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
    const index = api.selectedScrollSnap();
    setSelectedIndex(index);
    setPrevBtnDisabled(!api.canScrollPrev());
    setNextBtnDisabled(!api.canScrollNext());
    if (onSelectIndex) {
      onSelectIndex(index);
    }
  }, [onSelectIndex]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect(emblaApi);

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const slides = React.Children.toArray(children).filter(Boolean);

  const containerStyle = React.useMemo(() => {
    const style = {};
    if (slideGap) {
      style.gap = slideGap;
    }
    return style;
  }, [slideGap]);

  const computedSlideStyle = React.useMemo(() => {
    const style = { ...slideStyle };
    if (slideBasis) {
      style.flex = `0 0 ${slideBasis}`;
      style.maxWidth = slideBasis;
    }
    return style;
  }, [slideBasis, slideStyle]);

  const handleSlideClick = (index, event) => {
    if (onSlideClick) {
      onSlideClick(index, event);
    } else if (clickableSlides) {
      scrollTo(index);
    }
  };

  return (
    <div
      className={`embla-wrapper carousel ${fillHeight ? "fill-height" : ""} ${className}`}
      {...props}
    >
      <div className="embla" ref={emblaRef}>
        <div className="embla__container" style={containerStyle}>
          {slides.map((child, index) => (
            <div
              className={`embla__slide ${slideClassName}`}
              style={computedSlideStyle}
              key={index}
              onClick={(e) => handleSlideClick(index, e)}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {showArrows && slides.length > 1 && (
        <>
          <Avatar
            component={Paper}
            elevation={4}
            sx={{
              position: "absolute",
              top: "50%",
              left: 16,
              transform: "translateY(-50%)",
              zIndex: 3,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(8px)",
              color: "#1e293b",
              opacity: prevBtnDisabled && !loop ? 0.3 : 0.85,
              cursor: prevBtnDisabled && !loop ? "default" : "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                opacity: 1,
                backgroundColor: "#ffffff",
                boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
              },
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
              right: 16,
              transform: "translateY(-50%)",
              zIndex: 3,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(8px)",
              color: "#1e293b",
              opacity: nextBtnDisabled && !loop ? 0.3 : 0.85,
              cursor: nextBtnDisabled && !loop ? "default" : "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                opacity: 1,
                backgroundColor: "#ffffff",
                boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
              },
            }}
            onClick={scrollNext}
          >
            <NavigateNextIcon sx={{ width: 32, height: 32 }} />
          </Avatar>
        </>
      )}

      {showDots && scrollSnaps.length > 1 && (
        <div
          className="embla__dots"
          style={dotColor ? { "--embla-dot-active": dotColor } : undefined}
        >
          {scrollSnaps.map((_, index) => {
            const isSelected = index === selectedIndex;
            return (
              <span
                key={index}
                onClick={() => scrollTo(index)}
                className={`embla__dot ${isSelected ? "embla__dot--selected" : ""}`}
                style={
                  isSelected && dotColor
                    ? { backgroundColor: dotColor }
                    : undefined
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomCarousel;
