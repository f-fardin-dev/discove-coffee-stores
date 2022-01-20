import { useState } from "react";

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const [latlng, setLatlng] = useState("");
  const success = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setLatlng(`${latitude},${longitude}`);
    setLocationErrorMsg("");
    setIsFindingLocation(false);
  };

  const error = () => {
    setLocationErrorMsg("Unable to retrieve your location");
    setIsFindingLocation(false);
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setLocationErrorMsg("Gelocation is not supported by your browser!");
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    latlng,
    locationErrorMsg,
    isFindingLocation,
    handleTrackLocation,
  };
};

export default useTrackLocation;
