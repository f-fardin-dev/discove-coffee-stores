// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { airTable, findRecordByFilter, getMinifiedRecords } from "../../lib/airtable";

const votingCoffeeStore = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "method is not correct" });
  }
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const records = await findRecordByFilter(id);
    if (records && records.length !== 0) {
      const { voting, recordId } = records[0];
      const calculatedVoting = Number(voting) + 1;
      const updateRecord = await airTable.update([
        {
          id: recordId,
          fields: {
            voting: calculatedVoting,
          },
        },
      ]);
      if (updateRecord) {
        const records = getMinifiedRecords(updateRecord);
        res.json(records);
      }
    } else {
      return res.status(404).json({ message: "id could not be found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export default votingCoffeeStore;
