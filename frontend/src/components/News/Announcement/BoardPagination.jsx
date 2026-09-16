import { Pagination, PaginationItem } from "@mui/material";
import { Link } from "react-router";

const BoardPagination = ({ pages, currentPage, themeColor, themeBg }) => {
  const hasCustomTheme = Boolean(themeColor && themeColor !== "#FF6B00");

  return (
    <Pagination
      className="pagination"
      count={pages === 0 ? 1 : pages}
      page={Number(currentPage)}
      sx={{
        margin: "auto",
        mt: 1,
        mb: 4,
        ...(hasCustomTheme && {
          "& .MuiPaginationItem-root": {
            "&:hover": {
              bgcolor: themeBg || "rgba(0, 0, 0, 0.04)",
              borderColor: themeColor,
              color: themeColor,
            },
            "&.Mui-selected": {
              bgcolor: `${themeColor} !important`,
              borderColor: `${themeColor} !important`,
              boxShadow: themeBg ? `0 4px 12px ${themeBg}` : undefined,
              "&:hover": {
                bgcolor: `${themeColor} !important`,
              },
            },
          },
        }),
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
