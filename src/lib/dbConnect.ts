import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

export async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log('already connected')
        return
    }
    try {
       const db = await mongoose.connect(process.env.MONGODB_URI || "",{})
       connection.isConnected = db.connections[0].readyState

       console.log('db connected')
    } catch (error) {

        console.log('DB connection failed',error)
        process.exit(1)
        
    }
}