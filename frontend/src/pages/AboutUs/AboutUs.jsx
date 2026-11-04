import { useEffect, useCallback } from "react";
import { useLocation } from "react-router";
import "./AboutUs.css";

import AboutHero from "./AboutHero";
import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";
import Section4 from "./Section4";
import Section5 from "./Section5";
import Section6 from "./Section6";

const resolveTargetId = (rawHash) => {
  const hash = rawHash.replace(/^#/, "");
  if (!hash) return null;

  if (hash === "aboutus/offering" || hash === "offering" || hash === "aboutus-offering") {
    return "offering";
  }
  if (hash === "aboutus" || hash === "time" || hash === "worship") {
    return "worship";
  }
  if (hash === "name" || hash === "calling" || hash === "edmonton" || hash === "all" || hash === "on" || hash === "building") {
    return "calling";
  }
  if (hash === "beginning" || hash === "start" || hash === "story") {
    return "beginning";
  }
  if (hash === "direction" || hash === "lovegod" || hash === "loveneighbor") {
    return "direction";
  }
  if (hash === "ministers" || hash === "servers" || hash === "section4") {
    return "ministers";
  }

  return hash;
};

const About = () => {
  const location = useLocation();

  const scrollToSection = useCallback((id) => {
    const targetId = resolveTargetId(id) || id;
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Handle URL hash changes (deep linking from main buttons, navbar, etc.)
  useEffect(() => {
    if (!location.hash) return;
    const targetId = resolveTargetId(location.hash);
    if (!targetId) return;

    const timer = setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [location.hash]);

  return (
    <main className="aboutPage">
      <title>교회소개 - 에드먼턴 온 교회</title>

      <AboutHero onScrollTo={scrollToSection} />

      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
    </main>
  );
};

export default About;
