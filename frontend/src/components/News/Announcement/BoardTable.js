import {
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";

const BoardTable = ({ announcements, pages }) => {
  const navigate = useNavigate();
  return (
    <>
      <TableContainer className="table" component={Paper} sx={{ width: "95%" }}>
        <Table>
          {/* <TableHead>
            <TableRow>
              <TableCell align="center" width="80%">
                제목
              </TableCell>
              <TableCell align="center"> 작성일 </TableCell>
            </TableRow>
          </TableHead> */}
          <TableBody>
            {announcements ? (
              announcements.map((announcement) => (
                <TableRow
                  component={Link}
                  to={announcement.id}
                  key={announcement.id}
                  sx={{ textDecoration: "none" }}
                >
                  <TableCell>
                    <h3
                      style={{
                        display: "block",
                        maxWidth: "300px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {announcement.title}
                    </h3>
                    <p>
                      {format(new Date(announcement.timestamp), "yyyy/MM/dd")}
                    </p>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>게시물이 존재하지 않습니다.</TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        className="pagination"
        count={pages}
        variant="outlined"
        color="primary"
        // hideNextButton={pages === 1}
        // hidePrevButton={pages === numberOfAnnouncements}\
        sx={{ margin: "auto", my: 4, textAlign: "center" }}
        onChange={(_, pageNumber) => navigate(`?page=${pageNumber}`)}
      />
    </>
  );
};

export default BoardTable;
