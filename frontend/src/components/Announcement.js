import { collection, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../api/firebase";
import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";

const Announcement = () => {
  const [titleValue, setTitleValue] = useState(null);
  const [bodyValue, setBodyValue] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const docID = params.get("docID");

  async function getAnnouncement(id) {
    const docSnap = await getDoc(doc(db, "Announcement", id));
    setBodyValue(docSnap.data().body);
    setTitleValue(docSnap.data().title);
  }

  useEffect(() => {
    getAnnouncement(docID);
  });
  console.log(bodyValue);

  return (
    <div>
      <h2>{titleValue}</h2>
      {bodyValue ? (
        <div
          className="content"
          dangerouslySetInnerHTML={{
            __html: bodyValue,
          }}
        ></div>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default Announcement;
