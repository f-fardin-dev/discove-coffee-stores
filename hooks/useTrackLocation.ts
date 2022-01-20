import { useState } from "react";

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  const [latlng, setLatlng] = useState("");
  const success = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setLatlng(`${latitude},${longitude}`);
    setLocationErrorMsg("");
  };

  const error = () => {
    setLocationErrorMsg("Unable to retrieve your location");
  };

  const handleTrackLocation = () => {
    if (!navigator.geolocation) {
      setLocationErrorMsg("Gelocation is not supported by your browser!");
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    latlng,
    locationErrorMsg,
    handleTrackLocation,
  };
};

export default useTrackLocation;
