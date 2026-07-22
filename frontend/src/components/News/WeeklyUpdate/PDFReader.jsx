import { Box, IconButton, Typography, CircularProgress, Divider } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useState, useEffect } from "react";
import { pdfjs, Page, Document } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "./PDFReader.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

function PDFReader({ file, documentDimension }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  const add = () => {
    setScale((prev) => prev + 0.2);
  };

  const minus = () => {
    if (scale !== 1) {
      setScale((prev) => prev - 0.2);
    }
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
  }, [file]);

  return file ? (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          backgroundColor: "#ffffff",
          borderRadius: "40px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(0, 0, 0, 0.04)",
          px: 1.5,
          py: 0.5,
          mb: 3,
          gap: 0.5,
          transition: "all 0.3s ease",
        }}
      >
        <IconButton onClick={minus} disabled={scale <= 1} sx={{ color: "#757575", "&:hover": { color: "#FF6B00", bgcolor: "rgba(255,107,0,0.08)" } }}>
          <ZoomOutIcon />
        </IconButton>
        <Typography variant="body2" sx={{ fontWeight: 700, color: "#555", minWidth: "45px", textAlign: "center" }}>
          {Math.round(scale * 100)}%
        </Typography>
        <IconButton onClick={add} sx={{ color: "#757575", "&:hover": { color: "#FF6B00", bgcolor: "rgba(255,107,0,0.08)" } }}>
          <ZoomInIcon />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1, borderColor: "rgba(0,0,0,0.08)" }} />

        <IconButton onClick={previousPage} disabled={pageNumber <= 1} sx={{ color: "#FF6B00", "&:hover": { bgcolor: "rgba(255,107,0,0.08)" } }}>
          <KeyboardArrowLeftIcon />
        </IconButton>
        <Typography variant="body2" sx={{ fontWeight: 800, color: "#2b2b2b", minWidth: "55px", textAlign: "center" }}>
          {pageNumber} / {numPages || "-"}
        </Typography>
        <IconButton onClick={nextPage} disabled={pageNumber >= numPages} sx={{ color: "#FF6B00", "&:hover": { bgcolor: "rgba(255,107,0,0.08)" } }}>
          <KeyboardArrowRightIcon />
        </IconButton>
      </Box>

      <Document
        file={file}
        externalLinkTarget="__blank"
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div
            style={{
              height: documentDimension.height,
              width: documentDimension.width,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <CircularProgress sx={{ color: "#FF6B00" }} />
          </div>
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
            <div
              style={{
                height: documentDimension.height,
                width: documentDimension.width,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <CircularProgress sx={{ color: "#FF6B00" }} />
            </div>
          }
        />
      </Document>
    </Box>
  ) : (
    <Typography sx={{ color: "#888", mt: 4, fontWeight: 500 }}>
      해당 날짜의 주보가 존재하지 않습니다.
    </Typography>
  );
}

export default PDFReader;
