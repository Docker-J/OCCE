import React from 'react';
import ReactDOM from 'react-dom';
import ReactFullpage from '@fullpage/react-fullpage';
import Header from "../header/Header";

import "./about.css"

const About = () => (
  <ReactFullpage
    //fullpage options
    //licenseKey={'YOUR_KEY_HERE'}
    scrollingSpeed={1000} /* Options here */

    anchors={['churchname', 'whoserves', 'slide3']}
    // sectionsColor={['#f2aa31', '#f2aa31', 'f2aa31']}

    slidesNavigation={true}
    slidesNavPosition='top'
    scrollHorizontally={true}
    interlockedSlides={true}
    navigation={true}
    navigationPosition='right'

    render={({ state, fullpageApi }) => {
      return (
        <div className="fullpage">
          <ReactFullpage.Wrapper>
            <div className="section" id="section0">
              <p>Section 1 (welcome to fullpage.js)</p>
              <button onClick={() => fullpageApi.moveSectionDown()}>
                Click me to move down
              </button>
            </div>

            <div className="section">
              <div class="slide" data-anchor="pastorJhin"> 진성인 목사 </div>
              <div class="slide" data-anchor="pastorAhn"> 안주영 목사 </div>
              <div class="slide" data-anchor="pastorKim"> 김휘경 전도사 </div>
            </div>

            <div className="section">
              <p>Section 3</p>
            </div>
          </ReactFullpage.Wrapper>
        </div>
      );
    }}
  />
);

export default About;
