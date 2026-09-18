import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import AdminComponent from "../../../common/AdminComponent";
import CustomConfirmDialog from "../../../common/CustomConfirmDialog";

const PostAdminActions = ({
  actions = [],
  deleteConfirmOpen,
  onCloseDeleteConfirm,
  onConfirmDelete,
  deleteTitle = "삭제하시겠습니까?",
  deleteBody,
}) => {
  return (
    <AdminComponent>
      <SpeedDial
        ariaLabel="Post admin actions"
        sx={{ position: "fixed", bottom: 24, right: 24 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            slotProps={{ tooltip: { title: action.name } }}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>

      <CustomConfirmDialog
        title={deleteTitle}
        body={deleteBody}
        isOpen={deleteConfirmOpen}
        onClose={onCloseDeleteConfirm}
        onConfirm={onConfirmDelete}
      />
    </AdminComponent>
  );
};

export default PostAdminActions;
