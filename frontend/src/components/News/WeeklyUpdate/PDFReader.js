import { Button, ButtonGroup, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { pdfjs, Page, Document } from "react-pdf";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./PDFReader.css";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.js",
//   import.meta.url
// ).toString();

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFReader({ file, documentDimension }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  const add = () => {
    setScale((prev) => {
      return prev + 0.2;
    });
  };

  const minus = () => {
    if (scale !== 1) {
      setScale((prev) => {
        return prev - 0.2;
      });
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ButtonGroup id="scaleButton" sx={{ my: "1em" }}>
        <Button onClick={add} variant="outlined">
          +
        </Button>
        <Button onClick={minus} variant="outlined" disabled={scale <= 1}>
          -
        </Button>
      </ButtonGroup>

      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div
            style={{
              height: documentDimension.height,
              width: documentDimension.width,
            }}
          >
            <CircularProgress />
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
              }}
            >
              <CircularProgress />
            </div>
          }
        />
      </Document>

      <p style={{ color: "black" }}>
        Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
      </p>

      <ButtonGroup id="pageButton">
        <Button
          variant="outlined"
          disabled={pageNumber <= 1}
          onClick={previousPage}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          disabled={pageNumber >= numPages}
          onClick={nextPage}
        >
          Next
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default PDFReader;
