/**
 * @license Copyright (c) 2014-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import path from "path";
import webpack from "webpack";
import ckeditor5DevUtils from "@ckeditor/ckeditor5-dev-utils";
const { bundler, styles } = ckeditor5DevUtils;
import {
  CKEditorTranslationsPlugin,
} from "@ckeditor/ckeditor5-dev-translations";
import TerserWebpackPlugin from "terser-webpack-plugin";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  devtool: "source-map",
  performance: { hints: false },

  entry: path.resolve(__dirname, "src", "ckeditor.js"),

  output: {
    // The name under which the editor will be exported.
    library: {
      type: "module",
    },
    path: path.resolve(__dirname, "build"),
    filename: "ckeditor.esm.js",
  },

  experiments: {
    outputModule: true,
  },

  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          output: {
            // Preserve CKEditor 5 license comments.
            comments: /^!/,
          },
        },
        extractComments: false,
      }),
    ],
  },

  plugins: [
    new CKEditorTranslationsPlugin({
      // UI language. Language codes follow the https://en.wikipedia.org/wiki/ISO_639-1 format.
      // When changing the built-in language, remember to also change it in the editor's configuration (src/ckeditor.js).
      language: "en",
      additionalLanguages: "all",
    }),
    new webpack.BannerPlugin({
      banner: bundler.getLicenseBanner(),
      raw: true,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ["raw-loader"],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
            options: {
              injectType: "singletonStyleTag",
              attributes: {
                "data-cke": true,
              },
            },
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: styles.getPostCssConfig({
                themeImporter: {
                  themePath: require.resolve("@ckeditor/ckeditor5-theme-lark"),
                },
                minify: true,
              }),
            },
          },
        ],
      },
    ],
  },
};