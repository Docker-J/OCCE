import { Button, ButtonGroup, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { pdfjs } from "react-pdf";
import { Page } from "react-pdf";
import { Document } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

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
            pageNumber={pageNumber}
          />
        </Document>
      </p>

      <div>
        <p>
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
