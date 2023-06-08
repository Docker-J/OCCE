import "./Arrow.css";

const Arrow = (props) => {
  return (
    <div className="arrow" onClick={props.onClick}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default Arrow;
