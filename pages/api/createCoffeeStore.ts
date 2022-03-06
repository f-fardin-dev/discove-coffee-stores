import { NextApiRequest, NextApiResponse } from "next";
import { airTable, findRecordByFilter, getMinifiedRecords } from "../../lib/airtable";

const createCoffeeStore = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "method is not correct" });
  }
  const { id, name } = req.body;

  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }
  try {
    const records = await findRecordByFilter(Number(id));

    if (records && records.length !== 0) {
      res.json(records);
    } else {
      if (!name) {
        return res.status(400).json({ message: "name is required" });
      }
      const createdRecord = await airTable.create([
        {
          fields: { ...req.body },
        },
      ]);
      const records = getMinifiedRecords(createdRecord);
      res.json(records);
    }
  } catch (error) {
    console.error("Error create store", error);
    res.status(500).json({ message: "Error create store", error });
  }
};

export default createCoffeeStore;
