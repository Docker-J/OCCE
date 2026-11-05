import { postAnnouncement } from "../../../api/announcements";
import PostComposer from "../common/PostComposer";

const AnnouncementPostModal = ({
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
      queryKey={["announcements"]}
      successMessage="The announcement is successfully posted!"
      onSubmitPost={({ id: postId, title, body }) =>
        postAnnouncement(postId, title, body)
      }
    >
      <PostComposer.ModalFrame>
        <PostComposer.TitleInput fullWidth />
        <PostComposer.Editor />
        <PostComposer.SubmitButton />
      </PostComposer.ModalFrame>
    </PostComposer.Provider>
  );
};

export default AnnouncementPostModal;
