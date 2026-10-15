import React, { useState, useEffect, useRef, Suspense } from "react";
import { Typography } from "@mui/material";
import SocialIconsBar from "./SocialIconsBar";
import { Link } from "react-router";

const GoogleMap = React.lazy(() => import("./GoogleMap"));

const Footer = () => {
  const [showMap, setShowMap] = useState(false);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (showMap) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setShowMap(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShowMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (mapContainerRef.current) {
      observer.observe(mapContainerRef.current);
    }

    return () => observer.disconnect();
  }, [showMap]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#e8eaed",
        paddingTop: 30,
      }}
    >
      <Link to="/">
        <img loading="lazy" alt="Footer Logo"
          src="/img/HeaderLogoBW.png"
          style={{ width: "196.22px", height: "40px" }}
        />
      </Link>
      <Typography>Based ON the OLD Truth</Typography>
      <Typography>Moving ON to the NEW Calling</Typography>
      <Typography>온 맘 다해 하나님을 사랑하고</Typography>
      <Typography>온 힘 다해 이웃을 사랑하는 교회</Typography>

      <div style={{ marginTop: 10, marginBottom: 30 }}>
        <SocialIconsBar />
      </div>

      <div ref={mapContainerRef} style={{ width: "100%", minHeight: 300 }}>
        {showMap ? (
          <Suspense fallback={<div style={{ height: 300 }} />}>
            <GoogleMap />
          </Suspense>
        ) : (
          <div style={{ height: 300 }} />
        )}
      </div>
    </div>
  );
};

export default Footer;
