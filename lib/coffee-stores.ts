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

export const defaultCoffeeStoreImage =
  "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80";

interface CoffeeStores {
  results: CoffeeStore[];
}

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || "",
});

const getCoffeeStoresUrl = (latlng: string, query: string, limit?: number) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latlng}&query=${query}&limit=${limit || 7}`;
};

const getCoffeeStoresPhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 30,
  });
  const results = photos.response?.results;
  return results?.map(res => res.urls["small"]);
};

export const fetchCoffeeStores = async (latlng?: string, limit?: number): Promise<CoffeeStore[]> => {
  const url = getCoffeeStoresUrl(latlng || "43.65267,-79.39545", "coffee store", limit);
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY || "",
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
