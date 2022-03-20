// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { findRecordByFilter } from "../../lib/airtable";

const getCoffeeStoreById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const records = await findRecordByFilter(id as string);

    if (records && records.length !== 0) {
      return res.json(records);
    }
    return res.status(404).json({ message: "id could not be found" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export default getCoffeeStoreById;
