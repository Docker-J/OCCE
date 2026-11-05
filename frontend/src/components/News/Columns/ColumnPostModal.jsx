import { postColumn } from "../../../api/columns";
import PostComposer from "../common/PostComposer";

const ColumnPostModal = ({
  isOpen,
  onClose,
  revalidator,
  id,
  origTitle,
  origBody,
}) => {
  return (
    <PostComposer.Provider
      isOpen={isOpen}
      onClose={onClose}
      revalidator={revalidator}
      id={id}
      origTitle={origTitle}
      origBody={origBody}
      queryKey={["columns"]}
      successMessage="The column is successfully posted!"
      onSubmitPost={({ id: postId, title, body, selectedDate }) =>
        postColumn(postId, title, body, selectedDate)
      }
    >
      <PostComposer.ModalFrame>
        <div style={{ width: "100%" }}>
          <PostComposer.TitleInput fullWidth={false} sx={{ width: "85%" }} />
          <PostComposer.DatePicker sx={{ width: "10%" }} />
        </div>
        <PostComposer.Editor />
        <PostComposer.SubmitButton />
      </PostComposer.ModalFrame>
    </PostComposer.Provider>
  );
};

export default ColumnPostModal;
