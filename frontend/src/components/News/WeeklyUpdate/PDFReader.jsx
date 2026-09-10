import { Box, IconButton, Typography, Divider } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useState, useEffect } from "react";
import { pdfjs, Page, Document } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "./PDFReader.css";
import BulletinSkeleton from "./BulletinSkeleton";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const MIN_SCALE = 1.0;
const MAX_SCALE = 2.4;
const SCALE_STEP = 0.2;

function PDFReader({ file, loading = false, documentDimension }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(MIN_SCALE);

  const add = () => {
    setScale((prev) =>
      Math.min(MAX_SCALE, Math.round((prev + SCALE_STEP) * 10) / 10)
    );
  };

  const minus = () => {
    setScale((prev) =>
      Math.max(MIN_SCALE, Math.round((prev - SCALE_STEP) * 10) / 10)
    );
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  useEffect(() => {
    setPageNumber(1);
    setScale(MIN_SCALE);
  }, [file]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          py: 1,
        }}
      >
        <BulletinSkeleton
          documentDimension={documentDimension}
          scale={scale}
        />
      </Box>
    );
  }

  if (!file) {
    return (
      <Typography sx={{ color: "#888", mt: 4, fontWeight: 500 }}>
        해당 날짜의 주보가 존재하지 않습니다.
      </Typography>
    );
  }

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Document
        file={file}
        externalLinkTarget="__blank"
        onLoadSuccess={onDocumentLoadSuccess}
        suspense={false}
        loading={
          <BulletinSkeleton
            documentDimension={documentDimension}
            scale={scale}
          />
        }
        noData={
          <Typography sx={{ color: "#888", mt: 4, fontWeight: 500 }}>
            해당 날짜의 주보가 존재하지 않습니다.
          </Typography>
        }
      >
        <Page
          renderTextLayer={false}
          className="page"
          scale={scale}
          height={documentDimension.height}
          width={documentDimension.width}
          pageNumber={pageNumber}
          loading={
            <BulletinSkeleton
              documentDimension={documentDimension}
              scale={scale}
            />
          }
        />
      </Document>

      {/* Floating Control Bar - Sticky Bottom Center */}
      <Box
        sx={{
          position: "sticky",
          bottom: "30px",
          zIndex: 1000,
          display: "inline-flex",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: "40px",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 10px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(0, 0, 0, 0.15)",
          px: { xs: 1.5, sm: 2 },
          py: { xs: 0.8, sm: 1 },
          gap: { xs: 0.2, sm: 0.5 },
          transition: "all 0.3s ease",
          mt: 2,
          mb: 4,
        }}
      >
        <IconButton
          onClick={minus}
          disabled={scale <= MIN_SCALE}
          aria-label="주보 축소"
          sx={{
            color: "#757575",
            "&:hover": { color: "#FF6B00", bgcolor: "rgba(255,107,0,0.08)" },
          }}
        >
          <ZoomOutIcon />
        </IconButton>
        <IconButton
          onClick={add}
          disabled={scale >= MAX_SCALE}
          aria-label="주보 확대"
          sx={{
            color: "#757575",
            "&:hover": { color: "#FF6B00", bgcolor: "rgba(255,107,0,0.08)" },
          }}
        >
          <ZoomInIcon />
        </IconButton>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 1, my: 1, borderColor: "rgba(0,0,0,0.15)" }}
        />

        <IconButton
          onClick={previousPage}
          disabled={pageNumber <= 1}
          aria-label="이전 페이지"
          sx={{
            color: "#FF6B00",
            "&:hover": { bgcolor: "rgba(255,107,0,0.08)" },
          }}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 800,
            color: "#2b2b2b",
            minWidth: { xs: "40px", sm: "55px" },
            textAlign: "center",
            fontSize: { xs: "0.8rem", sm: "0.875rem" },
          }}
        >
          {pageNumber} / {numPages || "-"}
        </Typography>
        <IconButton
          onClick={nextPage}
          disabled={pageNumber >= numPages}
          aria-label="다음 페이지"
          sx={{
            color: "#FF6B00",
            "&:hover": { bgcolor: "rgba(255,107,0,0.08)" },
          }}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default PDFReader;
