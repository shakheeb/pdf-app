import mongoose from "mongoose";

let isConnected = false; // conection status

export const connectDB = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "pdfDB",
    });

    isConnected = true;
    console.log("MongoDB is connected");
  } catch (error) {
    console.log(error);
  }
};
