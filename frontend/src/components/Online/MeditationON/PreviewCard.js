import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useRef } from "react";

import { useDrag, useDrop } from "react-dnd";

const PreviewCard = ({ id, image, index, movePhoto, removeImage }) => {
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
        display: "inline-flex",
        borderRadius: 2,
        border: "1px solid #eaeaea",
        marginBottom: 8,
        marginRight: 8,
        width: "calc(90%/3)",
        aspectRatio: "1/1",
        boxSizing: "border-box",
        cursor: "move",
        opacity,
        overflow: "hidden",
      }}
    >
      <img
        src={image}
        alt="preview"
        style={{
          display: "block",
          width: "auto",
          height: "100%",
        }}
      />
      <IconButton
        sx={{
          position: "absolute",
          display: "block",
          zIndex: 99,
          top: 0,
          right: 0,
          backgroundColor: "orange",
        }}
        onClick={() => removeImage(index)}
      >
        <ClearIcon sx={{ color: "black" }} />
      </IconButton>
    </div>
  );
};

export default PreviewCard;
