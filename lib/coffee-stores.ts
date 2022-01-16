export interface CoffeeStore {
  fsq_id: number;
  name: string;
  location: {
    address: string;
    neighborhood?: string[];
  };
}
interface CoffeeStores {
  results: CoffeeStore[];
}

const getCoffeeStoresUrl = (latlng: string, query: string, limit?: number) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latlng}&query=${query}&limit=${limit || 7}`;
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

  const response = await fetch(url, options);
  const data: CoffeeStores = await response.json();
  return data.results;
};
