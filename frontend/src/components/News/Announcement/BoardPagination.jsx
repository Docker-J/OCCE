import { Pagination, PaginationItem } from "@mui/material";
import { Link } from "react-router";

const BoardPagination = ({ pages, currentPage, themeColor = "#FF6B00", themeBg = "rgba(255, 107, 0, 0.08)" }) => {
  return (
    <Pagination
      className="pagination"
      count={pages === 0 ? 1 : pages}
      page={Number(currentPage)}
      variant="outlined"
      shape="rounded"
      sx={{
        margin: "auto",
        mt: 1,
        mb: 4,
        "& .MuiPaginationItem-root": {
          borderRadius: "12px",
          border: "1px solid rgba(0,0,0,0.06)",
          bgcolor: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(8px)",
          color: "#555",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: themeBg,
            borderColor: themeColor,
            color: themeColor,
          },
          "&.Mui-selected": {
            bgcolor: themeColor,
            color: "white",
            border: `1px solid ${themeColor}`,
            fontWeight: 800,
            boxShadow: `0 4px 12px ${themeBg}`,
            "&:hover": {
              bgcolor: themeColor,
            }
          }
        }
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
