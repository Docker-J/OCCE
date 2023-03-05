import "./Arrow.css";

const Arrow = (props) => {
  return (
    <div class="arrow" onClick={props.onClick}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default Arrow;
