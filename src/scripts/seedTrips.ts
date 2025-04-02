import dotenv from "dotenv";
import mongoose from "mongoose";
import Trip from "../models/Trip";
// Load biến môi trường từ file .env
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "Lỗi: Biến môi trường MONGODB_URI chưa được đặt trong file .env"
  );
  process.exit(1);
}

// --- Dữ liệu mẫu --- Bạn có thể thay đổi hoặc thêm dữ liệu tại đây
const sampleTrips = [
  {
    name: "Chuyến đi Đà Lạt mộng mơ",
    startDate: new Date("2024-08-15"),
    endDate: new Date("2024-08-18"),
    note: "Khám phá thác Datanla và thưởng thức ẩm thực đêm.",
    createdBy: "67ed34e67682cb23632d7d63",
    updatedBy: "67ed34e67682cb23632d7d63",
  },
  {
    name: "Phượt Hà Giang mùa hoa tam giác mạch",
    startDate: new Date("2024-10-20"),
    endDate: new Date("2024-10-25"),
    // note để trống
    createdBy: "67ed34e67682cb23632d7d63",
    updatedBy: "67ed34e67682cb23632d7d63",
  },
  {
    name: "Nghỉ dưỡng tại Phú Quốc",
    startDate: new Date("2024-12-01"),
    endDate: new Date("2024-12-07"),
    note: "Tắm biển Bãi Sao, lặn ngắm san hô.",
    createdBy: "67ed34e67682cb23632d7d63",
    updatedBy: "67ed34e67682cb23632d7d63",
  },
];
// --- Kết thúc dữ liệu mẫu ---

const seedDatabase = async () => {
  console.log("Bắt đầu kết nối tới MongoDB...");
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Kết nối MongoDB thành công!");

    // Tùy chọn: Xóa dữ liệu cũ trước khi thêm mới
    // console.log("Đang xóa dữ liệu trips cũ...");
    // await Trip.deleteMany({});
    // console.log("Đã xóa dữ liệu trips cũ.");

    console.log("Bắt đầu thêm dữ liệu mẫu...");
    const createdTrips = await Trip.create(sampleTrips);
    console.log(`Đã thêm thành công ${createdTrips.length} chuyến đi.`);
    console.log(
      createdTrips.map((trip) => ({ name: trip.name, id: trip._id }))
    ); // In ra tên và ID của các trip đã tạo
  } catch (error) {
    console.error("Lỗi khi thêm dữ liệu:", error);
    process.exit(1);
  } finally {
    console.log("Đang đóng kết nối MongoDB...");
    await mongoose.disconnect();
    console.log("Đã đóng kết nối MongoDB.");
  }
};

// Chạy hàm seed
seedDatabase();
