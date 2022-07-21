import "./online.css";

const Online = () => {
  return (
    <div class="video">
      <div class="video-container">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/videoseries?list=PL-MVshquUXWGPQZ17w6vqSLGE4yJtYQ9H"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen="true"
        ></iframe>
      </div>
    </div>
  );
};

export default Online;
