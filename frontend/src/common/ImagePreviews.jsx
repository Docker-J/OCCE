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
  const movePhoto = (dragIndex, hoverIndex) => {
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
  };

  const removeImage = (i) => {
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
  };

  const renderCard = (image, index) => {
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
  };

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
