import type { Document } from "mongodb";
import db from "../db/conn.ts";

export interface DynamicValue extends Document {
  value_type: string;
  value: number;
  last_update: Date;
}

const DynamicValueModel = db.collection<DynamicValue>("dynamic_values");

export default DynamicValueModel;
