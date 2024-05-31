import { Avatar } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useRef } from "react";

import { useDrag, useDrop } from "react-dnd";

const ImagePreviewCard = ({
  id,
  image,
  index,
  cover,
  setCoverImage,
  movePhoto,
  removeImage,
}) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "previewcard",
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.7 : 1;
  const [{ handlerId }, drop] = useDrop({
    accept: "previewcard",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.left - hoverBoundingRect.right) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.x - hoverBoundingRect.left;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      movePhoto(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        borderRadius: 2,
        border: cover ? "5px solid #4bb543" : "1px solid #eaeaea",
        marginBottom: 8,
        marginRight: index % 3 !== 2 ? "calc(2%/2)" : 0,
        width: "calc(97%/3)",
        aspectRatio: "1/1",
        boxSizing: "border-box",
        cursor: "move",
        opacity,
        overflow: "hidden",
      }}
      onClick={() => {
        if (typeof setCoverImage === "function") setCoverImage(index);
      }}
    >
      <img
        src={image}
        alt="preview"
        style={{
          width: "auto",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <Avatar
        sx={{
          position: "absolute",
          zIndex: 99,
          top: 4,
          right: 4,
          backgroundColor: "#f57c00",
          cursor: "pointer",
          width: 30,
          height: 30,
        }}
        onClick={() => removeImage(index)}
      >
        <ClearIcon sx={{ color: "white" }} />
      </Avatar>
    </div>
  );
};

export default ImagePreviewCard;
