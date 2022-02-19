import Airtable, { FieldSet, Records } from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_KEY || "");

export const airTable = base("coffee-stores");

export const getMinifiedRecords = (records: Records<FieldSet>) => {
  return records.map(record => record.fields);
};
