import { useContext, useState } from "react";
import { Actions, StoreContext } from "../context/StoreContext";

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const { dispatch } = useContext(StoreContext);

  const success = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    dispatch({ type: Actions.SET_LATLNG, payload: `${latitude},${longitude}` });
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

  return { locationErrorMsg, isFindingLocation, handleTrackLocation };
};

export default useTrackLocation;
