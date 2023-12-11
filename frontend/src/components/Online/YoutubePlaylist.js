import "./YoutubePlaylist.css";

const YoutubePlaylist = ({ src }) => {
  return (
    <div className="video">
      <div className="video-container">
        <iframe
          src={src}
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default YoutubePlaylist;
