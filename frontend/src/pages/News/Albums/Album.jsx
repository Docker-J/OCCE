import { useLoaderData, useNavigate, useParams } from "react-router";

import { Fab, ImageList, ImageListItem, Typography, useMediaQuery, useTheme } from "@mui/material";

import useModals from "../../../util/useModal";
import PhotoViewModal from "./PhotoViewModal";
import AdminComponent from "../../../common/AdminComponent";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteAlbum } from "../../../api/albums";
import useSnackbar from "../../../util/useSnackbar";
import { useConfirm } from "../../../common/ConfirmProvider";

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
  const confirm = useConfirm();

  const handleDeleteAlbum = async () => {
    if (
      await confirm({
        title: "앨범 삭제",
        message: "정말로 이 앨범을 삭제하시겠습니까? 삭제된 사진은 복구할 수 없습니다.",
        confirmText: "삭제",
        cancelText: "취소",
        confirmColor: "error",
        severity: "error",
      })
    ) {
      await deleteAlbum(albumID);
      sessionStorage.removeItem("albums");
      openSnackbar("success", "The album deleted successfully");
      navigate("/albums");
    }
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
          onClick={handleDeleteAlbum}
        >
          <DeleteIcon />
        </Fab>
      </AdminComponent>
    </>
  );
};

export default Album;
