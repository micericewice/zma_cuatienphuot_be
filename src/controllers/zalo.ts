import { Request, Response } from "express";
import { ERROR_MESSAGES, STATUS_CODES } from "../utils/constants";

export const getUserInfoFromZalo = async (
  req: Request,
  res: Response
): Promise<any> => {
  const accessToken = req.headers["authorization"];

  let url = "https://graph.zalo.me/v2.0/me?fields=id,name,picture";

  let options: any = {
    method: "GET",
    headers: {
      access_token: accessToken,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.status(STATUS_CODES.SUCCESS).json({ success: true, data });
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
  }
};
