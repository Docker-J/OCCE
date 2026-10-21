import OCCEErrorBoundary from "../../common/OCCEErrorBoundary";

const YoutubePlaylist = ({ src }) => {
  return (
    <div className="video">
      <div className="video-container">
        <OCCEErrorBoundary
          title="영상을 불러올 수 없습니다"
          description="YouTube 플레이어를 불러오지 못했습니다. 아래 링크를 통해 YouTube에서 직접 시청하실 수 있습니다."
          fallbackLink={{
            label: "YouTube에서 시청하기",
            url: "https://www.youtube.com/@oncce",
          }}
          compact
        >
          <iframe
            src={src}
            title="YouTube video player"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </OCCEErrorBoundary>
      </div>
    </div>
  );
};

export default YoutubePlaylist;
