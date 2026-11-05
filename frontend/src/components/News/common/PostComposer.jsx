/**
 * @file PostComposer.jsx
 * @description 공지사항(Announcement) 및 목회칼럼(Column) 작성/수정 모달을 위한
 * React 19 Compound Component (state-context-interface, architecture-compound-components)
 */

import {
  createContext,
  use,
  useState,
  useActionState,
  startTransition,
  lazy,
  Suspense,
} from "react";
import PropTypes from "prop-types";
import { Button, CircularProgress, TextField } from "@mui/material";
import useSnackbar from "../../../util/useSnackbar";
import CustomModal from "../../../common/CustomModal";
import ButtonDatePicker from "../../../common/ButtonDatePicker";
import OCCEErrorBoundary from "../../../common/OCCEErrorBoundary";
import { queryClient } from "../../../index";

const TextEditor = lazy(() => import("../Announcement/TextEditor"));

export const PostComposerContext = createContext(null);
export const usePostComposerContext = () => use(PostComposerContext);

const Provider = ({
  isOpen,
  onClose,
  revalidator,
  id,
  origTitle = "",
  origBody = "",
  queryKey,
  successMessage,
  onSubmitPost,
  children,
}) => {
  const { openSnackbar } = useSnackbar();

  const [title, setTitle] = useState(origTitle);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [body, setBody] = useState(origBody);
  const [prevProps, setPrevProps] = useState({ id, origTitle, origBody });

  // Render-time state adjustment when props change (avoids secondary useEffect render cycle)
  if (
    prevProps.id !== id ||
    prevProps.origTitle !== origTitle ||
    prevProps.origBody !== origBody
  ) {
    setPrevProps({ id, origTitle, origBody });
    setTitle(origTitle);
    setBody(origBody);
  }

  const handleClose = () => {
    setTitle(origTitle);
    setBody(origBody);
    onClose();
  };

  const [, formAction, isPending] = useActionState(async () => {
    try {
      await onSubmitPost({ id, title, body, selectedDate });
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey });
      }
      revalidator?.();
      openSnackbar("success", successMessage);
      handleClose();
      return { success: true };
    } catch (error) {
      console.error(error);
      openSnackbar(
        "error",
        "Error Occured. Please contact to the administrator."
      );
      return { error };
    }
  }, null);

  const submit = () => {
    startTransition(() => formAction());
  };

  const contextValue = {
    state: {
      isOpen,
      title,
      body,
      selectedDate,
      isPending,
      canSubmit: !isPending && title.trim() !== "" && body.trim() !== "",
    },
    actions: {
      setTitle,
      setBody,
      setSelectedDate,
      handleClose,
      submit,
    },
  };

  return (
    <PostComposerContext value={contextValue}>{children}</PostComposerContext>
  );
};

Provider.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  revalidator: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  origTitle: PropTypes.string,
  origBody: PropTypes.string,
  queryKey: PropTypes.arrayOf(PropTypes.string),
  successMessage: PropTypes.string.isRequired,
  onSubmitPost: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const ModalFrame = ({
  maxWidth = "1300px",
  maxHeight = "90svh",
  children,
}) => {
  const { state, actions } = usePostComposerContext();

  return (
    <CustomModal
      isOpen={state.isOpen}
      onClose={actions.handleClose}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
    >
      {state.isPending ? <CircularProgress /> : children}
    </CustomModal>
  );
};

ModalFrame.propTypes = {
  maxWidth: PropTypes.string,
  maxHeight: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const TitleInput = ({ fullWidth = true, sx }) => {
  const { state, actions } = usePostComposerContext();

  return (
    <TextField
      id="filled-basic"
      label="Title"
      variant="outlined"
      value={state.title}
      fullWidth={fullWidth}
      sx={sx}
      onChange={(e) => actions.setTitle(e.target.value)}
      required
    />
  );
};

TitleInput.propTypes = {
  fullWidth: PropTypes.bool,
  sx: PropTypes.object,
};

const DatePicker = ({ sx = { width: "10%" } }) => {
  const { state, actions } = usePostComposerContext();

  return (
    <ButtonDatePicker
      sx={sx}
      value={state.selectedDate}
      onChange={actions.setSelectedDate}
    />
  );
};

DatePicker.propTypes = {
  sx: PropTypes.object,
};

const Editor = ({ height = "65svh" }) => {
  const { state, actions } = usePostComposerContext();

  return (
    <div style={{ height, width: "100%", marginTop: "1em" }}>
      <OCCEErrorBoundary
        title="본문 편집기를 불러오는 중 오류가 발생했습니다"
        resetKeys={[state.body]}
      >
        <Suspense fallback={<CircularProgress />}>
          <TextEditor body={state.body} getBody={actions.setBody} />
        </Suspense>
      </OCCEErrorBoundary>
    </div>
  );
};

Editor.propTypes = {
  height: PropTypes.string,
};

const SubmitButton = ({ label = "Post", sx = { marginTop: "1.5em" } }) => {
  const { state, actions } = usePostComposerContext();

  return (
    <Button
      variant="outlined"
      disabled={!state.canSubmit}
      onClick={actions.submit}
      fullWidth
      sx={sx}
    >
      {label}
    </Button>
  );
};

SubmitButton.propTypes = {
  label: PropTypes.string,
  sx: PropTypes.object,
};

export const PostComposer = {
  Provider,
  ModalFrame,
  TitleInput,
  DatePicker,
  Editor,
  SubmitButton,
};

export default PostComposer;
