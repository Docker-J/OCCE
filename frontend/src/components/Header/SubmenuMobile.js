import { Typography } from "@mui/material";
import { CascadingMenuItem, CascadingSubmenu } from "./CascadingMenus";

const SubmenuMobile = (props) => {
  return props.page.to ? (
    <CascadingMenuItem {...props}>
      <Typography fontSize="13pt">{props.page.title}</Typography>
    </CascadingMenuItem>
  ) : (
    <CascadingSubmenu {...props}>
      {props.page.subpages.map((page) => (
        <CascadingMenuItem key={page.title} page={page}>
          <Typography sx={{ fontSize: "13pt" }}>{page.title}</Typography>
        </CascadingMenuItem>
      ))}
    </CascadingSubmenu>
  );
};

export default SubmenuMobile;
