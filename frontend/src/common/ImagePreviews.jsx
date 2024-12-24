import { useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import ImagePreviewCard from "./ImagePreviewCard";

const ImagePreviews = ({
  imagesPreview,
  cover,
  setCoverImage,
  setImagesPreview,
  setFilesToUpload,
}) => {
  const movePhoto = useCallback(
    (dragIndex, hoverIndex) => {
      setFilesToUpload((prev) =>
        update(prev, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prev[dragIndex]],
          ],
        })
      );
      setImagesPreview((prev) =>
        update(prev, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prev[dragIndex]],
          ],
        })
      );
    },
    [setFilesToUpload, setImagesPreview]
  );

  const removeImage = useCallback(
    (i) => {
      URL.revokeObjectURL(imagesPreview[i]);
      setFilesToUpload((prev) =>
        update(prev, {
          $splice: [[i, 1]],
        })
      );
      setImagesPreview((prev) =>
        update(prev, {
          $splice: [[i, 1]],
        })
      );
    },
    [imagesPreview, setFilesToUpload, setImagesPreview]
  );

  const renderCard = useCallback(
    (image, index) => {
      return (
        <ImagePreviewCard
          key={index}
          index={index}
          image={image}
          cover={index === cover}
          setCoverImage={setCoverImage}
          movePhoto={movePhoto}
          removeImage={removeImage}
        />
      );
    },
    [cover, movePhoto, removeImage, setCoverImage]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignContent: "flex-start",
          justifyContent: "space-between",
          margin: "10pt",
          width: "100%",
          height: "68vh",
          overflowX: "auto",
        }}
      >
        {imagesPreview.map((image, index) => renderCard(image, index))}
      </div>
    </DndProvider>
  );
};

export default ImagePreviews;
