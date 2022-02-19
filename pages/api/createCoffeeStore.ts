import Airtable from "airtable";
import { NextApiRequest, NextApiResponse } from "next";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_KEY || "");

const table = base("coffee-stores");

console.log({ table });

const createCoffeeStore = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.json({ message: "method is not correct" });
  }

  try {
    const findCoffeeStoreRecord = await table
      .select({
        filterByFormula: `id="0"`,
      })
      .firstPage();

    if (findCoffeeStoreRecord.length !== 0) {
      const records = findCoffeeStoreRecord.map(record => record.fields);
      res.json(records);
    } else {
      res.json({ message: "create a record" });
    }
  } catch (error) {
    console.log("Error create store", error);
    res.status(500).json({ message: "Error create store", error });
  }
};

export default createCoffeeStore;
