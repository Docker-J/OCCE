import { Button, ButtonGroup, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { pdfjs, Page, Document } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "./PDFReader.css";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url
// ).toString();

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

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
    <div>
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
        externalLinkTarget="__blank"
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
  ) : (
    <p>해당 날짜의 주보가 존재하지 않습니다.</p>
  );
}

export default PDFReader;
