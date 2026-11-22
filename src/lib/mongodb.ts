import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || (process.env.NODE_ENV === "production" ? "" : "mongodb://127.0.0.1:27017/jontrohaat");
if (!uri || uri === "your_mongodb_connection_string") {
  throw new Error("MONGODB_URI must be configured for production");
}
const dbName = process.env.DB_NAME || "jontrohaat";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDatabase() {
  const connectedClient = await clientPromise;
  return connectedClient.db(dbName);
}
