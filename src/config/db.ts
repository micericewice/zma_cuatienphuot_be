import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Lỗi: Biến môi trường MONGODB_URI chưa được đặt.");
  process.exit(1); // Thoát ứng dụng nếu thiếu URI
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Kết nối MongoDB thành công!");

    mongoose.connection.on("error", (err) => {
      console.error("Lỗi kết nối MongoDB:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Đã ngắt kết nối MongoDB.");
    });
  } catch (error) {
    console.error("Không thể kết nối tới MongoDB:", error);
    // Thoát tiến trình nếu không kết nối được trong lần đầu
    process.exit(1);
  }
};

export default connectDB;
