import { ViewTransition } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router";

import { Fab, ImageList, ImageListItem, Typography, useMediaQuery, useTheme } from "@mui/material";

import useModals from "../../../util/useModal";
import AdminComponent from "../../../common/AdminComponent";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteAlbum } from "../../../api/albums";
import useSnackbar from "../../../util/useSnackbar";
import { useConfirm } from "../../../common/ConfirmProvider";
import { useQueryClient } from "@tanstack/react-query";
import { BackToListFab } from "../../../components/News/common";

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
  const queryClient = useQueryClient();

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
      queryClient?.invalidateQueries({ queryKey: ["albums"] });
      openSnackbar("success", "The album deleted successfully");
      navigate("/albums");
    }
  };

  return (
    <>
      <title>{`${title || "사진"} - OCCE`}</title>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <ViewTransition
            name={`album-title-${albumID}`}
            share="text-morph"
            default="none"
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 830,
                letterSpacing: "0.4em",
                pl: "0.4em",
                color: "white",
              }}
            >
              {title}
            </Typography>
          </ViewTransition>
        </div>
      </div>
      <div className="container-wrapper">
        <div className="container">
          <ImageList variant="masonry" cols={cols} gap={10}>
            {Object.values(images).map((image, index) => {
              const imgEl = (
                <img
                  style={{ objectFit: "contain", width: "100%", display: "block" }}
                  src={`https://imagedelivery.net/ICo2WI8PXO_BVRlWfwzOww/${image}/MeditationON`}
                  alt={title ? `${title} - 사진 ${index + 1}` : `교회사진 ${index + 1}`}
                  loading="lazy"
                />
              );

              return (
                <ImageListItem
                  key={image}
                  onClick={async () => {
                    const { default: PhotoViewModalComponent } = await import(
                      "./PhotoViewModal"
                    );
                    openModal(PhotoViewModalComponent, {
                      photos: images,
                      initialIndex: index,
                    });
                  }}
                  sx={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                      cursor: "pointer",
                    },
                  }}
                >
                  {index === 0 ? (
                    <ViewTransition
                      name={`album-cover-${albumID}`}
                      share="morph"
                      default="none"
                    >
                      {imgEl}
                    </ViewTransition>
                  ) : (
                    imgEl
                  )}
                </ImageListItem>
              );
            })}
          </ImageList>
        </div>
        <BackToListFab
          themeColor="#1e3a8a"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1, { viewTransition: true });
            } else {
              navigate("/albums", { viewTransition: true });
            }
          }}
        />
      </div>
      <AdminComponent>
        <Fab
          variant="primary"
          aria-label="앨범 삭제"
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
