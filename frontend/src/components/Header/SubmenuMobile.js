import { CascadingMenuItem, CascadingSubmenu } from "./CascadingMenus";

const SubmenuMobile = (props) => {
  return props.page.to ? (
    <CascadingMenuItem {...props}>
      <span style={{ fontSize: "13pt" }}>{props.page.title}</span>
    </CascadingMenuItem>
  ) : (
    <CascadingSubmenu {...props}>
      {props.page.subpages.map((page) => (
        <CascadingMenuItem key={page.title} page={page}>
          <span style={{ fontSize: "13pt" }}>{page.title}</span>
        </CascadingMenuItem>
      ))}
    </CascadingSubmenu>
  );

  // // <>
  //   {/* <MenuItem
  //     key={props.page.title}
  //     onClick={props.page.to && props.menuPopupState.close}
  //     component={props.page.to && Link}
  //     to={props.page.to}
  //     sx={{ py: 1.5 }}
  //     {...(props.page.subpages && bindHover(popupState))}
  //   >
  //     <Typography sx={{ fontSize: "13pt" }}>{props.page.title}</Typography>
  //     <ListItemIcon>
  //       {props.page.subpages &&
  //         (popupState.isOpen ? (
  //           <ExpandLessIcon sx={{ ml: "8px" }} />
  //         ) : (
  //           <ExpandMoreIcon sx={{ ml: "8px" }} />
  //         ))}
  //     </ListItemIcon>
  //   </MenuItem>

  //   {props.page.subpages && (
  //     <HoverMenu
  //       {...bindMenu(popupState)}
  //       anchorOrigin={{ vertical: "top", horizontal: "right" }}
  //       transformOrigin={{ vertical: "top", horizontal: "left" }}
  //     >
  //       {props.page.subpages.map((subpage) => (
  //         <MenuItem
  //           key={subpage.title}
  //           onClick={handleClose}
  //           component={Link}
  //           to={subpage.to}
  //         >
  //           <Typography sx={{ fontSize: "13pt" }}>{subpage.title}</Typography>
  //         </MenuItem>
  //       ))}
  //     </HoverMenu>
  //   )} */}
  // // </>
};

export default SubmenuMobile;
