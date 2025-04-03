import { Request, Response } from "express";
import { IProtectRequest } from "../interfaces";
import Trip from "../models/Trip";
import { ERROR_MESSAGES, STATUS_CODES } from "../utils/constants";
// @desc    Lấy thông tin trips
// @route   GET /trips
// @access  Private
export const getTrips = async (
  req: IProtectRequest | Request,
  res: Response
): Promise<any> => {
  try {
    const user = (req as IProtectRequest).user;

    const page = parseInt(req.query.page as string) || 1; // Lấy số trang từ query, mặc định là 1
    const limit = parseInt(req.query.limit as string) || 10; // Lấy kích thước trang từ query, mặc định là 10
    const skip = (page - 1) * limit; // Tính toán số bản ghi cần bỏ qua

    const trips = await Trip.find({ createdBy: user._id })
      .skip(skip)
      .limit(limit);

    const total = await Trip.countDocuments({ createdBy: user._id }); // Đếm tổng số trips
    const totalPages = Math.ceil(total / limit); // Tính tổng số trang

    return res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      data: trips,
      pagination: {
        total: total,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};

// @desc    Lấy thông tin trip theo id
// @route   GET /:id
// @access  Private
export const getTripById = async (
  req: IProtectRequest | Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);

    if (!trip) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    return res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    console.error(error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};

// @desc    Tạo trip mới
// @route   POST /trip
// @access  Private
export const createTrip = async (
  req: Request | IProtectRequest,
  res: Response
): Promise<any> => {
  try {
    const { name, note, startDate, endDate } = req.body;
    const { _id } = (req as IProtectRequest).user;

    const trip = await Trip.create({
      name,
      startDate,
      note,
      endDate,
      createdBy: _id,
      updatedBy: _id,
    });

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    console.error(error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};
