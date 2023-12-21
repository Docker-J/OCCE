import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "200px",
};

const center = {
  lat: 53.53120758825804,
  lng: -113.47254286783863,
};

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={17}
      options={{
        fullscreenControl: false,
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
      }}
      //   onLoad={onLoad}
      onUnmount={onUnmount}
      clickableIcons={false}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <>
        <Marker
          position={center}
          icon={{
            url: "/img/OCCE_logo_circle_rim_color.png",
            scaledSize: { height: 30, width: 30 },
          }}
        />
      </>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
