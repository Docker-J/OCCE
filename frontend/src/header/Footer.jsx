import React, { useState, useEffect, useRef, Suspense } from "react";
import { Box, Typography } from "@mui/material";
import SocialIconsBar from "./SocialIconsBar";
import { Link } from "react-router";
import OCCEErrorBoundary from "../common/OCCEErrorBoundary";

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
    <Box
      component="footer"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        pt: 4,
      }}
    >
      <Link to="/" style={{ display: "inline-block" }}>
        <img
          loading="lazy"
          alt="에드먼턴 온 교회 로고"
          src="/img/HeaderLogoBW.png"
          style={{ width: "196.22px", height: "40px", display: "block" }}
        />
      </Link>

      <Box sx={{ my: 2, textAlign: "center", px: 2 }}>
        <Typography
          sx={{
            fontSize: "0.82rem",
            fontWeight: 700,
            letterSpacing: "1px",
            color: "#64748b",
            textTransform: "uppercase",
            mb: 0.5,
          }}
        >
          Based ON the OLD Truth · Moving ON to the NEW Calling
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "0.95rem", sm: "1.05rem" },
            fontWeight: 700,
            color: "#1e293b",
            letterSpacing: "-0.3px",
          }}
        >
          온 맘 다해 하나님을 사랑하고 온 힘 다해 이웃을 사랑하는 교회
        </Typography>
      </Box>

      <Box sx={{ mb: 2.5 }}>
        <SocialIconsBar />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: { xs: 0.8, sm: 2 },
          mb: 1.5,
          px: 2,
          color: "#64748b",
          fontSize: "0.85rem",
        }}
      >
        <Typography variant="body2" sx={{ color: "inherit", fontWeight: 500 }}>
          주일예배: 주일 오전 11:00
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "inherit", display: { xs: "none", sm: "inline" } }}
        >
          •
        </Typography>
        <Typography
          component="a"
          href="https://goo.gl/maps/gqpiA88gJSvbjfDD9"
          target="_blank"
          rel="noopener noreferrer"
          variant="body2"
          sx={{
            color: "inherit",
            textDecoration: "none",
            "&:hover": { color: "#FF6B00", textDecoration: "underline" },
          }}
        >
          9419 95 St, Edmonton, AB T6C 4K2
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "inherit", display: { xs: "none", sm: "inline" } }}
        >
          •
        </Typography>
        <Typography
          component="a"
          href="mailto:office@oncce.ca"
          variant="body2"
          sx={{
            color: "inherit",
            textDecoration: "none",
            "&:hover": { color: "#FF6B00", textDecoration: "underline" },
          }}
        >
          office@oncce.ca
        </Typography>
      </Box>

      <Typography
        variant="caption"
        sx={{
          color: "#94a3b8",
          mb: 3,
          fontWeight: 500,
          letterSpacing: "0.2px",
          textAlign: "center",
          px: 2,
        }}
      >
        © {new Date().getFullYear()} 에드먼턴 온 교회 (ON Community Church of Edmonton). All rights reserved.
      </Typography>

      <Box
        ref={mapContainerRef}
        sx={{
          width: "100%",
          minHeight: 300,
          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        {showMap ? (
          <OCCEErrorBoundary
            title="지도를 불러올 수 없습니다"
            fallbackLink={{
              label: "Google 지도에서 보기",
              url: "https://goo.gl/maps/gqpiA88gJSvbjfDD9",
            }}
            compact
          >
            <Suspense fallback={<div style={{ height: 300 }} />}>
              <GoogleMap />
            </Suspense>
          </OCCEErrorBoundary>
        ) : (
          <div style={{ height: 300 }} />
        )}
      </Box>
    </Box>
  );
};

export default Footer;
