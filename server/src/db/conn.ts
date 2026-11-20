import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri?.startsWith("mongodb://") && !uri?.startsWith("mongodb+srv://")) {
  throw new Error("MONGODB_URI no está definida o no tiene un formato válido");
}

const client = new MongoClient(uri);

try {
  // Connect the client to the server
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("data").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
} catch (err) {
  throw new Error(`Error al conectar a MongoDB: ${err}`);
}

let db = client.db("data");

export default db;
