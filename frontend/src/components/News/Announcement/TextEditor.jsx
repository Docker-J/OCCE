import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Autoformat,
  Alignment,
  Base64UploadAdapter,
  BlockQuote,
  Bold,
  Essentials,
  Font,
  Heading,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  Table,
  TableToolbar,
  TextTransformation,
  Underline,
} from "ckeditor5";

// Import the core styles directly in your component
import "ckeditor5/ckeditor5.css";
import "./TextEditor.css";

const TextEditor = ({ body, getBody }) => {
  return (
      <CKEditor
        editor={ClassicEditor}
        data={body}
        config={{
          // REQUIRED for v44+ (2025/2026)
          licenseKey: "GPL",
          plugins: [
            Autoformat,
            Alignment,
            Base64UploadAdapter,
            BlockQuote,
            Bold,
            Essentials,
            Font,
            Heading,
            Image,
            ImageCaption,
            ImageResize,
            ImageStyle,
            ImageToolbar,
            ImageUpload,
            Indent,
            Italic,
            Link,
            List,
            MediaEmbed,
            Paragraph,
            PasteFromOffice,
            Table,
            TableToolbar,
            TextTransformation,
            Underline,
          ],
          toolbar: {
            items: [
              "heading",
              "|",
              "bold",
              "italic",
              "underline",
              "fontSize",
              "fontColor",
              "fontBackgroundColor",
              "|",
              "alignment",
              "|",
              "link",
              "bulletedList",
              "numberedList",
              "|",
              "outdent",
              "indent",
              "|",
              "imageUpload",
              "blockQuote",
              "insertTable",
              "mediaEmbed",
              "undo",
              "redo",
            ],
          },
          image: {
            toolbar: [
              "toggleImageCaption",
              "|",
              "imageStyle:inline",
              "imageStyle:block",
              "imageStyle:side",
            ],
          },
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
          mediaEmbed: {
            previewsInData: true,
          },
        }}
        onChange={(_, editor) => {
          const data = editor.getData();
          getBody(data);
        }}
      />
  );
};

export default TextEditor;
