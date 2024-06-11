import { useLoaderData, useNavigate, useParams } from "react-router-dom";

import { Fab, ImageList, ImageListItem, Typography } from "@mui/material";

import "../../NextGen/NextGen.css";
import useModals from "../../../util/useModal";
import PhotoViewModal from "./PhotoViewModal";
import AdminComponent from "../../../common/AdminComponent";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteAlbum } from "../../../api/albums";
import useSnackbar from "../../../util/useSnackbar";

const titleBackground = {
  backgroundImage:
    'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("/img/Online/MeditationON.webp")',
};

const Album = () => {
  const navigate = useNavigate();
  let { albumID } = useParams();

  const { openModal } = useModals();
  const { openSnackbar } = useSnackbar();
  const { title, images } = useLoaderData();

  const handleDeleteAlbum = async () => {
    console.log("try delete");
    await deleteAlbum(albumID);
    openSnackbar("success", "The album deleted successfully");
    navigate("/albums");
  };

  return (
    <>
      <div className="title-wrapper" style={titleBackground}>
        <div className="title">
          <Typography
            variant="h4"
            fontWeight={830}
            sx={{ letterSpacing: "0.4em", pl: "0.4em", color: "white" }}
          >
            {title}
          </Typography>
        </div>
      </div>

      <div className="container-wrapper">
        <div className="container">
          <ImageList variant="masonry" cols={3} gap={8}>
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
