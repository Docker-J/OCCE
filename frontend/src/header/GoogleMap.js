import { memo, useState } from "react";
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";

const containerStyle = {
  width: "100%",
  height: "200px",
};

const center = {
  lat: 53.53120758825804,
  lng: -113.47254286783863,
};

const GoogleMap = memo(() => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [infowindowShown, setInfowindowShown] = useState(false);

  const toggleInfoWindow = () =>
    setInfowindowShown((previousState) => !previousState);

  const closeInfoWindow = () => setInfowindowShown(false);

  return (
    <div style={containerStyle}>
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <Map
          // styles={mapStyle}
          defaultCenter={center}
          defaultZoom={14}
          disableDefaultUI={true}
          mapId="96730a2a3f5e9934"
        >
          <AdvancedMarker
            ref={markerRef}
            position={center}
            onClick={toggleInfoWindow}
          >
            <img
              alt="OCCE Circle Logo"
              height={30}
              src="/img/OCCE_logo_circle_rim_color.png"
            ></img>
          </AdvancedMarker>

          {infowindowShown && (
            <InfoWindow anchor={marker} onCloseClick={closeInfoWindow}>
              <h2>Hello everyone!</h2>
              <p>This is an Info Window</p>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
});

export default GoogleMap;
