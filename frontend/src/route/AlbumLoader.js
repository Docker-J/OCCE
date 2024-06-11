import { getAlbum } from "../api/albums";

export function loader({ params }) {
  return getAlbum(params.albumID);
}
