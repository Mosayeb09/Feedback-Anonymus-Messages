// import mongoose from "mongoose";

// type ConnectionObject = {
//   isConnected?: number;
// };

// const connection: ConnectionObject = {};

// async function dbConnect(): Promise<void> {
//   if (connection.isConnected) {
//     console.log("Already connected to the database");
//     return;
//   }

//   if (!process.env.MONGODB_URL) {
//     console.error("MONGODB_URL is not defined in environment variables.");
//     process.exit(1); // Exit the process with failure
//   }

//   try {
//     const db = await mongoose.connect(process.env.MONGODB_URL, {
//       dbName: process.env.MONGODB_DB_NAME, // Optional, specify if you use `dbName`
//     });

//     connection.isConnected = db.connections[0].readyState;
//     console.log("Database connected successfully");
//   } catch (error) {
//     console.error("DB connection failed:", error);
//     process.exit(1); // Exit the process with failure
//   }
// }

// export default dbConnect;



import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

 async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log('already connected')
        return
    }
    try {
       const db = await mongoose.connect(process.env.MONGODB_URL || "",{})
       connection.isConnected = db.connections[0].readyState

       console.log('db connected successfully')
    } catch (error) {

        console.log('DB connection failed',error)
        process.exit(1)
        
    }
}
export default dbConnect;


