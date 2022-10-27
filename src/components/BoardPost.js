import { Button, TextField } from "@mui/material";
import TextEditor from "./TextEditor";
import { useState } from "react";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../api/firebase";

import { useEffect } from "react";

const BoardPost = (props) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [postButton, setPostButton] = useState("false");

  const getBody = (body) => {
    setBody(body);
  };

  async function postAnnouncement() {
    await addDoc(collection(db, "Announcement"), {
      title: title,
      body: body,
      date: serverTimestamp(),
    });
  }

  useEffect(() => {
    setPostButton(title.trim() === "" || body.trim() === "");
  }, [{ title, body }]);

  return (
    <div>
      <TextField
        id="filled-basic"
        label="Title"
        variant="outlined"
        onChange={(event) => setTitle(event.target.value)}
      />
      <TextEditor body={body} getBody={getBody} />
      <Button
        variant="outlined"
        disabled={postButton}
        onClick={postAnnouncement}
      >
        Post
      </Button>
      <Button variant="outlined" onClick={props.handleClose}>
        Cancel
      </Button>
    </div>
  );
};

export default BoardPost;
