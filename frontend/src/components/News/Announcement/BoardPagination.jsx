import { Pagination, PaginationItem } from "@mui/material";
import { Link } from "react-router";

const BoardPagination = ({ pages, currentPage }) => {
  return (
    <Pagination
      className="pagination"
      count={pages === 0 ? 1 : pages}
      page={Number(currentPage)}
      variant="outlined"
      color="primary"
      sx={{
        margin: "auto",
        mt: 4,
      }}
      renderItem={(item) => (
        <PaginationItem
          component={Link}
          to={`?page=${item.page}`}
          {...item}
        />
      )}
    />
  );
};

export default BoardPagination;
