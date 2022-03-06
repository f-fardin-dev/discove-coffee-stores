// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { findRecordByFilter } from "../../lib/airtable";

const getCoffeeStoresByLocation = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const records = await findRecordByFilter(Number(id));

    if (records && records.length !== 0) {
      res.json(records);
    }
    return res.status(404).json({ message: "id could not be found" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export default getCoffeeStoresByLocation;
