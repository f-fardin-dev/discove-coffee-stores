import { createApi } from "unsplash-js";

export interface CoffeeStore {
  fsq_id: number;
  name: string;
  imgUrl?: string;
  location: {
    address: string;
    neighborhood?: string[];
  };
}
interface CoffeeStores {
  results: CoffeeStore[];
}

const unsplashApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || "",
});

const getCoffeeStoresUrl = (latlng: string, query: string, limit?: number) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latlng}&query=${query}&limit=${limit || 7}`;
};
const getCoffeeStoresPhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 10,
  });
  const results = photos.response?.results;
  return results?.map(res => res.urls["small"]);
};

export const fetchCoffeeStores = async () => {
  const url = getCoffeeStoresUrl("43.65267,-79.39545", "coffee store");
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.FOURSQUARE_API_KEY || "",
    },
  };
  const photos = await getCoffeeStoresPhotos();
  const response = await fetch(url, options);
  const data: CoffeeStores = await response.json();
  return data.results.map((res, idx) => ({
    ...res,
    imgUrl: photos ? photos[idx] : "",
  }));
};
