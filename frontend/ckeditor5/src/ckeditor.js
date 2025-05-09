/**
 * @license Copyright (c) 2014-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
// import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor.js";
// import Autoformat from "@ckeditor/ckeditor5-autoformat/src/autoformat.js";
// import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment.js";
// import Base64UploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter.js";
// import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote.js";
// import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold.js";
// import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials.js";
// import Font from "@ckeditor/ckeditor5-font/src/font.js";
// import Heading from "@ckeditor/ckeditor5-heading/src/heading.js";
// import Image from "@ckeditor/ckeditor5-image/src/image.js";
// import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption.js";
// import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize.js";
// import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle.js";
// import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar.js";
// import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload.js";
// import Indent from "@ckeditor/ckeditor5-indent/src/indent.js";
// import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic.js";
// import Link from "@ckeditor/ckeditor5-link/src/link.js";
// import List from "@ckeditor/ckeditor5-list/src/list.js";
// import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed.js";
// import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph.js";
// import PasteFromOffice from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice.js";
// import Table from "@ckeditor/ckeditor5-table/src/table.js";
// import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar.js";
// import TextTransformation from "@ckeditor/ckeditor5-typing/src/texttransformation.js";
// import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline.js";

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

import "ckeditor5/ckeditor5.css";

class Editor extends ClassicEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
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
];

// Editor configuration.
Editor.defaultConfig = {
  licenseKey: "GPL",
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
  language: "en",
  image: {
    toolbar: [
      "toggleImageCaption",
      "|",
      "imageStyle:inline",
      "imageStyle:block",
      "imageStyle:side",
    ],
    insert: {
      type: "auto",
    },
  },
  mediaEmbed: {
    previewsInData: true,
  },
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },
};

export default Editor;
