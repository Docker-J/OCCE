const YoutubePlaylist = ({ src }) => {
  return (
    <div className="video">
      <div className="video-container">
        <iframe
          src={src}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default YoutubePlaylist;
