import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import "./TextEditor.css";

const TextEditor = ({ getBody }) => {
  return (
    <CKEditor
      editor={Editor}
      onChange={(_, editor) => {
        const data = editor.getData();
        getBody(data);
      }}
    />
  );
};

export default TextEditor;
