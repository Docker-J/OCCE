import { Button, ButtonGroup, CircularProgress } from "@mui/material";
import { isMobile } from "react-device-detect";
import { useState, useEffect } from "react";
import { pdfjs, Page, Document } from "react-pdf";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./PDFReader.css";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.js",
//   import.meta.url
// ).toString();

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFReader(props) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  const add = () => {
    setScale(scale + 0.2);
  };

  const minus = () => {
    if (scale !== 1) {
      setScale(scale - 0.2);
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
  }, [props.file]);

  const width = isMobile
    ? document.documentElement.clientWidth
    : window.innerWidth;
  const height = isMobile
    ? document.documentElement.clientHeight
    : window.innerHeight;

  const [windowDimension, detectHW] = useState({
    width: height / width >= 16 / 10 ? width - 30 : null,
    height: height / width < 16 / 10 ? height : null,
  });

  const detectSize = () => {
    const width = isMobile
      ? document.documentElement.clientWidth
      : window.innerWidth;
    const height = isMobile
      ? document.documentElement.clientHeight
      : window.innerHeight;

    detectHW({
      width: height / width >= 16 / 10 ? width - 30 : null,
      height: height / width < 16 / 10 ? height : null,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);

    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimension]);

  return (
    <>
      <div style={{ marginTop: "1em", marginBottom: "1em" }}>
        <ButtonGroup id="scaleButton">
          <Button onClick={add} variant={"outlined"}>
            +
          </Button>
          <Button onClick={minus} variant={"outlined"} disabled={scale <= 1}>
            -
          </Button>
        </ButtonGroup>
      </div>

      <Document
        file={props.file}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<CircularProgress />}
      >
        <Page
          renderTextLayer={false}
          className="page"
          scale={scale}
          height={windowDimension.height}
          width={windowDimension.width}
          pageNumber={pageNumber}
        />
      </Document>

      <div>
        <p style={{ color: "black" }}>
          Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
        </p>
        <ButtonGroup id="pageButton">
          <Button
            type="button"
            variant={"outlined"}
            disabled={pageNumber <= 1}
            onClick={previousPage}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant={"outlined"}
            disabled={pageNumber >= numPages}
            onClick={nextPage}
          >
            Next
          </Button>
        </ButtonGroup>
      </div>
    </>
  );
}

export default PDFReader;
