import "./AboutUs.css";
import ReactFullpage from "@fullpage/react-fullpage";

import Arrow from "../../components/AboutUs/Arrow";
import MinisterCarousel from "../../components/AboutUs/MinisterCarousel";

import Section from "./Section";
import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";
import Section5 from "./Section5";

const About = () => {
  return (
    <ReactFullpage
      //fullpage options
      licenseKey={"YOUR_KEY_HERE"}
      scrollingSpeed={1000} /* Options here */
      anchors={["beginning", "name", "direction", "ministers", "aboutus"]}
      // slidesNavigation={true}
      // slidesNavPosition="bottom"
      scrollOverflow={true}
      verticalCentered={true}
      normalScrollElements=".lovegod"
      // navigation={true}
      // navigationPosition="right"
      controlArrows={false}
      render={({ state, fullpageApi }) => {
        return (
          <ReactFullpage.Wrapper>
            <Section fullpageApi={fullpageApi} id="section1">
              <Section1 />
            </Section>

            <Section fullpageApi={fullpageApi} id="section2">
              <Section2 />
            </Section>

            <Section fullpageApi={fullpageApi} id="section3">
              <Section3 />
            </Section>

            <div className="section fp-noscroll" id="section4">
              <div className="section4Body sectionBody">
                <MinisterCarousel />
              </div>
              <Arrow onClick={() => fullpageApi.moveSectionDown()} />
            </div>

            <Section fullpageApi={fullpageApi} id="section5">
              <Section5 />
            </Section>
          </ReactFullpage.Wrapper>
        );
      }}
    />
  );
};

export default About;
