import { useLoaderData, useNavigate, useParams } from "react-router";

import { Fab, ImageList, ImageListItem, Typography, useMediaQuery, useTheme } from "@mui/material";

import useModals from "../../../util/useModal";
import PhotoViewModal from "./PhotoViewModal";
import AdminComponent from "../../../common/AdminComponent";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteAlbum } from "../../../api/albums";
import useSnackbar from "../../../util/useSnackbar";
import CustomConfirmDialog from "../../../common/CustomConfirmDialog";
import { useState } from "react";

const titleBackground = {
  backgroundImage: 'url("/img/News/Albums/Albums.webp")',
  backgroundPosition: "32% 22%",
};

const Album = () => {
  const navigate = useNavigate();
  let { albumID } = useParams();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const cols = isMobile ? 1 : isTablet ? 2 : 3;

  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();
  const { title, images } = useLoaderData();

  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);

  const handleDeleteAlbum = async () => {
    await deleteAlbum(albumID);
    sessionStorage.removeItem("albums");
    openSnackbar("success", "The album deleted successfully");
    setDeleteConfirmDialog(false);
    navigate("/albums");
  };

  return (
    <>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 830,
              letterSpacing: "0.4em",
              pl: "0.4em",
              color: "white"
            }}>
            {title}
          </Typography>
        </div>
      </div>
      <div className="container-wrapper">
        <div className="container">
          <ImageList variant="masonry" cols={cols} gap={8}>
            {Object.values(images).map((image, index) => (
              <ImageListItem
                key={image}
                onClick={() =>
                  openModal(PhotoViewModal, {
                    photos: images,
                    initialIndex: index,
                  })
                }
              >
                <img
                  style={{ objectFit: "contain" }}
                  src={`https://imagedelivery.net/ICo2WI8PXO_BVRlWfwzOww/${image}/MeditationON`}
                  alt="test"
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      </div>
      <AdminComponent>
        <Fab
          variant="primary"
          style={{ position: "fixed", right: "2vw", bottom: "3vh" }}
          onClick={() => setDeleteConfirmDialog(true)}
        >
          <DeleteIcon />
        </Fab>

        <CustomConfirmDialog
          title="삭제하시겠습니까?"
          body={`"${title}" 앨범이 삭제됩니다.`}
          isOpen={deleteConfirmDialog}
          onClose={() => setDeleteConfirmDialog(false)}
          onConfirm={handleDeleteAlbum}
        />
      </AdminComponent>
    </>
  );
};

export default Album;
