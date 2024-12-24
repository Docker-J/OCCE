import { Pagination } from "@mui/material";
import { useNavigate } from "react-router";

const BoardPagination = ({ pages, currentPage }) => {
  const navigate = useNavigate();

  return (
    <Pagination
      className="pagination"
      count={pages === 0 ? 1 : pages}
      page={Number(currentPage)}
      variant="outlined"
      color="primary"
      // hideNextButton={pages === 1}
      // hidePrevButton={pages === numberOfAnnouncements}
      sx={{
        margin: "auto",
        mt: 4,
      }}
      onChange={(_, pageNumber) => navigate(`?page=${pageNumber}`)}
    />
  );
};

export default BoardPagination;
