import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { format } from "date-fns";
import { Link } from "react-router-dom";

import PushPinIcon from "@mui/icons-material/PushPin";

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
                  px: 2,
                  py: 1,
                }}
              >
                <TableCell>
                  {format(new Date(announcement.timestamp), "MMM dd yyyy")}
                </TableCell>
                <TableCell>
                  <h3
                    style={{
                      display: "block",
                      width: "100%",
                      maxWidth: "1000px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Stack direction="row" alignItems="center">
                      {announcement.pin ? <PushPinIcon sx={{ mr: 1 }} /> : null}
                      {announcement.title}
                    </Stack>
                  </h3>

                  <div
                    className="content"
                    dangerouslySetInnerHTML={{
                      __html: announcement.body,
                    }}
                  />
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