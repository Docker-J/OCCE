import { Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BoardPagination = ({ pages }) => {
  const navigate = useNavigate();

  return (
    <Pagination
      className="pagination"
      count={pages === 0 ? 1 : pages}
      variant="outlined"
      color="primary"
      // hideNextButton={pages === 1}
      // hidePrevButton={pages === numberOfAnnouncements}
      sx={{
        margin: "auto",
        my: 4,
      }}
      onChange={(_, pageNumber) => navigate(`?page=${pageNumber}`)}
    />
  );
};

export default BoardPagination;
