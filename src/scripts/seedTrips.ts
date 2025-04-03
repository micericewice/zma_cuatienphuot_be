import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Trip from "../models/Trip";
import User, { IUser } from "../models/User";
// Load biến môi trường từ file .env
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "Lỗi: Biến môi trường MONGODB_URI chưa được đặt trong file .env"
  );
  process.exit(1);
}

const createRandomTrip = (users: IUser[]) => () => {
  return {
    name: faker.lorem.sentence(),
    startDate: faker.date.future(),
    endDate: faker.date.future(),
    note: faker.lorem.paragraph(),
    createdBy: users[Math.floor(Math.random() * users.length)]._id,
    updatedBy: users[Math.floor(Math.random() * users.length)]._id,
  };
};

const createSampleTrips = (user: IUser[]) =>
  faker.helpers.multiple(createRandomTrip(user), {
    count: 10,
  });

// --- Dữ liệu mẫu --- Bạn có thể thay đổi hoặc thêm dữ liệu tại đây
const seedDatabase = async () => {
  console.log("Bắt đầu kết nối tới MongoDB...");
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Kết nối MongoDB thành công!");

    // Lấy danh sách người dùng từ cơ sở dữ liệu
    const users = await User.find({});
    if (users.length === 0) {
      console.error("Lỗi: Không có người dùng nào trong cơ sở dữ liệu.");
      process.exit(1);
    }

    // Tùy chọn: Xóa dữ liệu cũ trước khi thêm mới
    //   console.log("Đang xóa dữ liệu trips cũ...");
    // await Trip.deleteMany({});
    //   console.log("Đã xóa dữ liệu trips cũ.");

    console.log("Bắt đầu thêm dữ liệu mẫu...");
    const createdTrips = await Trip.create(createSampleTrips(users));
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
