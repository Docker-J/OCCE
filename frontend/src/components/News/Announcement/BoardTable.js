import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const BoardTable = ({ announcements }) => {
  return (
    <TableContainer className="table" component={Paper}>
      <Table>
        <TableBody>
          {announcements ? (
            announcements.map((announcement) => (
              <TableRow
                component={Link}
                to={announcement.id}
                key={announcement.id}
                sx={{
                  textDecoration: "none",
                  backgroundColor: announcement.pin ? "lightgrey" : null,
                }}
              >
                <TableCell sx={{ px: 2, py: 1 }}>
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
  );
};

export default BoardTable;
