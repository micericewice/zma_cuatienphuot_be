import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import User from "../models/User";

import dotenv from "dotenv";

// Load biến môi trường từ file .env
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "Lỗi: Biến môi trường MONGODB_URI chưa được đặt trong file .env"
  );
  process.exit(1);
}

function createRandomUser() {
  return {
    zaloId: faker.string.uuid(),
    name: faker.person.fullName(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

const sampleUsers = faker.helpers.multiple(createRandomUser, {
  count: 5,
});

const seedDatabase = async () => {
  console.log("Bắt đầu kết nối tới MongoDB...");
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Kết nối MongoDB thành công!");

    // Tùy chọn: Xóa dữ liệu cũ trước khi thêm mới
    //   console.log("Đang xóa dữ liệu users cũ...");
    //   await User.deleteMany({});
    //   console.log("Đã xóa dữ liệu users cũ.");

    console.log("Bắt đầu thêm dữ liệu mẫu...");
    const createdUsers = await User.create(sampleUsers);
    console.log(`Đã thêm thành công ${createdUsers.length} người dùng.`);
    console.log(
      createdUsers.map((user) => ({ name: user.name, id: user._id }))
    ); // In ra tên và ID của các người dùng đã tạo
  } catch (error) {
    console.error("Lỗi khi thêm dữ liệu:", error);
    process.exit(1);
  } finally {
    console.log("Đang đóng kết nối MongoDB...");
    await mongoose.disconnect();
    console.log("Đã đóng kết nối MongoDB.");
  }
};

seedDatabase();
