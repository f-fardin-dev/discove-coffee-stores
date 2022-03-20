import Airtable, { FieldSet, Records } from "airtable";
import { CoffeeStore } from "./coffee-stores";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_KEY || "");

export const airTable = base("coffee-stores");

interface AirTableCoffeeStore extends CoffeeStore {
  recordId: string;
}
export const getMinifiedRecords = (records: Records<FieldSet>): AirTableCoffeeStore[] => {
  return records.map(record => ({
    recordId: record.id,
    ...(record.fields as unknown as CoffeeStore),
  }));
};

export const findRecordByFilter = async (id: number | string) => {
  const findRecord = await airTable
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return findRecord.length !== 0 ? getMinifiedRecords(findRecord) : null;
};
