import { Request, Response } from "express";
import Trip from "../models/Trip";
import { ERROR_MESSAGES, STATUS_CODES } from "../utils/constants";

// @desc    Lấy thông tin trips
// @route   GET /api/trips
// @access  Private
export const getTrips = async (req: Request, res: Response): Promise<any> => {
  try {
    const trips = await Trip.find();

    if (!trips) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ success: false, message: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    return res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      data: trips,
    });
  } catch (error) {
    console.error(error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};
