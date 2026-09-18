import { useState } from "react";
import { Fab } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";

import AdminComponent from "../../../common/AdminComponent";
import CustomConfirmDialog from "../../../common/CustomConfirmDialog";
import useModals from "../../../util/useModal";

const WeeklyUpdateAdminFabs = ({ selectedDate, onDateChange, onDeleteConfirm }) => {
  const { openModal } = useModals();
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);

  const handleUploadClick = async () => {
    const { default: WeeklyUpdatePostModalComponent } = await import(
      "./WeeklyUpdatePostModal"
    );

    openModal(WeeklyUpdatePostModalComponent, {
      setParentDate: onDateChange,
    });
  };

  const handleConfirmDelete = async () => {
    setDeleteConfirmDialog(false);
    await onDeleteConfirm?.();
  };

  return (
    <AdminComponent>
      <Fab
        id="uploadBulletinButton"
        onClick={handleUploadClick}
      >
        <UploadIcon />
      </Fab>

      <Fab
        id="deleteBulletinButton"
        sx={{
          backgroundColor: "#d10000",
          color: "white",
          ":hover": { backgroundColor: "#ff0000" },
        }}
        onClick={() => setDeleteConfirmDialog(true)}
      >
        <DeleteIcon />
      </Fab>

      <CustomConfirmDialog
        title="삭제하시겠습니까?"
        body={`${format(selectedDate, "yyyyMMdd")} 주보가 삭제됩니다`}
        isOpen={deleteConfirmDialog}
        onClose={() => setDeleteConfirmDialog(false)}
        onConfirm={handleConfirmDelete}
      />
    </AdminComponent>
  );
};

export default WeeklyUpdateAdminFabs;
