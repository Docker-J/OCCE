import { useState } from "react";

import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";

const TextEditor = ({ getBody }) => {
  return (
    <div style={{ width: "100%", alignItems: "center" }}>
      <CKEditor
        editor={Editor}
        // data="<p>Hello from CKEditor 5!</p>"
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor is ready to use!", editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          getBody(data);
        }}
        // onBlur={(event, editor) => {
        //   console.log("Blur.", editor);
        // }}
        // onFocus={(event, editor) => {
        //   console.log("Focus.", editor);
        // }}
      />
    </div>
  );
};

export default TextEditor;
