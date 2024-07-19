import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log(connection.isConnected);
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {}); //!
    // console.log(db);
    connection.isConnected = db.connections[0].readyState; // db.connection is the connection object that gives an array.
    //readyState is a property of the connection object that gives the state of the connection. 1 means connected, 0 means disconnected.
    console.log("Connected to database successfully");
    console.log(
      "value of db.connections[0].readyState: ",
      db.connections[0].readyState
    );
    // console.log(process.env.MONGODB_URI);
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
}

export default dbConnect();
