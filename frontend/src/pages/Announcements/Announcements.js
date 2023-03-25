import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Box,
  CircularProgress,
  Fab,
  Modal,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useScrollTrigger,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  getDoc,
  orderBy,
  query,
  limit,
  startAfter,
} from "firebase/firestore";

import { db } from "../../api/firebase";

import "./Announcements.css";
import BoardPost from "../../components/Announcement/BoardPost";

const Announcements = () => {
  const [body, setBody] = useState("");

  const getBody = (body) => {
    setBody(body);
  };

  const [numberOfAnnouncements, setNumberOfAnnouncements] = useState(1);
  const [announcements, setAnnouncements] = useState(null);
  const [pages, setPages] = useState(0);
  const [prevPage, setPrevPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const lastVisible =
    announcements && announcements.docs[announcements.docs.length - 1];

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  async function getInitialAnnouncements() {
    const numberOfAnnouncements = await getDoc(
      doc(db, "Misc", "Announcements")
    );
    setNumberOfAnnouncements(numberOfAnnouncements.data().posts);

    const querySnap = await getDocs(
      query(collection(db, "Announcement"), orderBy("date", "desc"), limit(10))
    );
    setAnnouncements(querySnap);
  }

  async function getAnnouncements() {
    const querySnap = await getDocs(
      query(
        collection(db, "Announcement"),
        orderBy("date", "desc"),
        startAfter(lastVisible),
        limit(10)
      )
    );
    setAnnouncements(querySnap);
  }

  async function postAnnouncement() {
    await setDoc(doc(db, "Misc", "Announcements"), {
      posts: 15,
    });
  }

  function pageChnageHandler(event, pageNumber) {
    setCurrentPage(pageNumber);
  }

  useEffect(() => {
    getInitialAnnouncements();
  }, []);

  useEffect(() => {
    getAnnouncements();
  }, [currentPage]);

  useEffect(() => {
    if (announcements !== null) {
      if (numberOfAnnouncements % 10 !== 0) {
        setPages(Math.floor(numberOfAnnouncements / 10 + 1));
      } else {
        setPages(Math.floor(numberOfAnnouncements / 10));
      }
    }
  }, [announcements]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "1500px",
    height: "80%",
    bgcolor: "#ffffff",
    border: "0.1px solid #f57c00",
    boxShadow: 24,
    p: 2,
  };

  return (
    <>
      <div
        className="board"
        style={{
          width: "100%",
          maxWidth: "1500px",
        }}
      >
        <h1>공지사항</h1>

        <div>
          <TableContainer
            className="table"
            component={Paper}
            sx={{ width: "85%" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" width="80%">
                    제목
                  </TableCell>
                  <TableCell align="center"> 작성일 </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {announcements ? (
                  announcements.docs.map((announcement) => (
                    <TableRow
                      component={Link}
                      to={
                        "/announcements/announcement?docID=" + announcement.id
                      }
                      sx={{ textDecoration: "none" }}
                    >
                      <TableCell>{announcement.data().title}</TableCell>
                      <TableCell align="right">
                        {announcement
                          .data()
                          .date.toDate()
                          .toLocaleDateString("en-US")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <CircularProgress />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            className="pagination"
            count={pages}
            variant="outlined"
            color="primary"
            hideNextButton={pages === 1}
            hidePrevButton={pages === numberOfAnnouncements}
            onChange={(event, pageNumber) =>
              pageChnageHandler(event, pageNumber)
            }
          />
        </div>
      </div>
      <Fab
        variant="primary"
        style={{ position: "fixed", right: "2vw", bottom: "3vh" }}
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>

      <Modal
        open={openModal}
        onClose={handleClose}
        // aria-labelledby="modal-modal-title"
        // aria-describedby="modal-modal-description"
      >
        <Box sx={style} bgcolor="white">
          <BoardPost handleClose={handleClose} />
        </Box>
      </Modal>
    </>
  );
};

export default Announcements;
