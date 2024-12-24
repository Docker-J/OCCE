import { Children, cloneElement } from "react";
import Arrow from "../../components/AboutUs/Arrow";

const Section = ({ id, fullpageApi, children, last }) => (
  <div className="section" id={id}>
    {Children.map(children, (child) => {
      return cloneElement(child, { fullpageApi });
    })}
    {last || <Arrow onClick={() => fullpageApi.moveSectionDown()} />}
  </div>
);

export default Section;
