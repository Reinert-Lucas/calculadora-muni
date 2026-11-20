import type { Document } from "mongodb";
import db from "../db/conn.ts";

export interface User extends Document {
  username: string;
  password: string;
}

const UserModel = db.collection<User>("users");

export default UserModel;