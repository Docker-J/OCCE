import { collection, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../api/firebase";
import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";

import { Carousel } from "react-responsive-carousel";
import styles from "react-responsive-carousel/lib/styles/carousel.min.css";

const MeditationONPost = () => {
  // const [images, setImages] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const docID = params.get("docID");

  // async function getAnnouncement(id) {
  //   const docSnap = await getDoc(doc(db, "MeditationON", id));
  //   setImages(docSnap.data().images);
  // }

  // useEffect(() => {
  //   getAnnouncement(docID);
  // });

  return (
    <>
      <h1>묵상 ON</h1>
      <div
        style={{
          position: "absolute",
          width: "90%",
          maxWidth: "900px",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: "30px",
        }}
      >
        <Carousel styles={styles}>
          <img src="/img/square.jpg" />
          <img src="/img/square.jpg" />
          <img src="/img/square.jpg" />
          <img src="/img/square.jpg" />
        </Carousel>
      </div>
    </>
  );
};

export default MeditationONPost;
