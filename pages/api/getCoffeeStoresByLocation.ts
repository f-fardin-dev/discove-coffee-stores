// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { CoffeeStore, fetchCoffeeStores } from "../../lib/coffee-stores";

const getCoffeeStoresByLocation = async (
  req: NextApiRequest,
  res: NextApiResponse<CoffeeStore[] | { message: string; error: unknown }>,
) => {
  try {
    const { latlng, limit } = req.query;
    const coffeeStoresNearby = await fetchCoffeeStores(latlng as string, parseInt(limit as string));
    res.status(200).json(coffeeStoresNearby);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export default getCoffeeStoresByLocation;
