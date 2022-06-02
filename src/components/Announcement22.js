import file from "./test.pdf"
import { useState } from 'react';
import { PDFReader } from "reactjs-pdf-reader";
import './announcement.css'

const Announcement = () => {
  const [scale, setScale] = useState(1);
  const add = () => {
    setScale(scale + 1);
  };
  const minus = () => {
    const increment = scale - 1;
    setScale(scale - 1);
  };

  return (
    <div className="App">
        <button onClick={add}>+</button>
        <button onClick={minus}>-</button>
      <PDFReader showAllPage={false} url={file} scale={scale} />
    </div>
  );
}

export default Announcement;