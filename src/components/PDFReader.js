import { Button, ButtonGroup, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { pdfjs, Page, Document } from "react-pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

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

  const [windowDimenion, detectHW] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const detectSize = () => {
    detectHW({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);

    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimenion]);

  console.log(windowDimenion.height - 400);

  return (
    <div>
      <ButtonGroup id="scaleButton">
        <Button onClick={add} variant={"outlined"}>
          +
        </Button>
        <Button onClick={minus} variant={"outlined"} disabled={scale <= 1}>
          -
        </Button>
      </ButtonGroup>

      <p>
        <Document
          file={props.file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<CircularProgress />}
        >
          <Page
            renderTextLayer={false}
            className="page"
            scale={scale}
            height={
              windowDimenion.height * 10 < windowDimenion.width * 16
                ? windowDimenion.height - 400
                : null
            }
            width={
              windowDimenion.height * 10 > windowDimenion.width * 16
                ? windowDimenion.width - 30
                : null
            }
            pageNumber={pageNumber}
          />
        </Document>
      </p>

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
    </div>
  );
}

export default PDFReader;
