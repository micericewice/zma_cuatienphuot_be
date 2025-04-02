import dotenv from "dotenv";
import mongoose from "mongoose";
import Trip from "../models/Trip"; // Đảm bảo đường dẫn này chính xác

// Load biến môi trường từ file .env
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "Lỗi: Biến môi trường MONGODB_URI chưa được đặt trong file .env"
  );
  process.exit(1);
}

const queryTrips = async () => {
  console.log("Bắt đầu kết nối tới MongoDB...");
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Kết nối MongoDB thành công!");

    console.log("Bắt đầu truy vấn dữ liệu trips...");
    // Tìm tất cả các trip trong collection
    const allTrips = await Trip.find({});

    if (allTrips.length === 0) {
      console.log("Không tìm thấy chuyến đi nào trong cơ sở dữ liệu.");
    } else {
      console.log(`Tìm thấy ${allTrips.length} chuyến đi:`);
      // In thông tin chi tiết của từng trip ra console
      allTrips.forEach((trip, index) => {
        console.log(`--- Chuyến đi ${index + 1} ---`);
        console.log(`  ID: ${trip._id}`);
        console.log(`  Tên: ${trip.name}`);
        console.log(
          `  Ngày bắt đầu: ${trip.startDate.toLocaleDateString("vi-VN")}`
        );
        console.log(
          `  Ngày kết thúc: ${trip.endDate.toLocaleDateString("vi-VN")}`
        );
        console.log(`  Ghi chú: ${trip.note || "(không có)"}`);
        console.log(`  Người tạo: ${trip.createdBy}`);
        console.log(`  Ngày tạo: ${trip.createdAt.toLocaleString("vi-VN")}`); // Sử dụng createdAt từ timestamps
        console.log(`  Người cập nhật: ${trip.updatedBy}`);
        console.log(
          `  Ngày cập nhật: ${trip.updatedAt.toLocaleString("vi-VN")}`
        ); // Sử dụng updatedAt từ timestamps
      });
    }
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    process.exit(1);
  } finally {
    console.log("Đang đóng kết nối MongoDB...");
    await mongoose.disconnect();
    console.log("Đã đóng kết nối MongoDB.");
  }
};

// Chạy hàm query
queryTrips();
