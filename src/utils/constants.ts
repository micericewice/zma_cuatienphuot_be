/**
 * HTTP Status Codes
 */
export const STATUS_CODES = {
  // Success responses
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client error responses
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server error responses
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type StatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES];

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  // Authentication errors
  EMAIL_PASSWORD_REQUIRED: "Vui lòng cung cấp email và mật khẩu",
  INVALID_CREDENTIALS: "Thông tin đăng nhập không hợp lệ",
  EMAIL_ALREADY_EXISTS: "Email đã được đăng ký",
  UNAUTHORIZED_ACCESS: "Không có quyền truy cập vào route này",
  TOKEN_REQUIRED: "Vui lòng cung cấp token xác thực",
  INVALID_TOKEN: "Token không hợp lệ hoặc đã hết hạn",
  EMAIL_MISMATCH: "Email đăng ký không khớp với tài khoản đã xác thực",

  // User errors
  USER_NOT_FOUND: "Không tìm thấy người dùng",
  INSUFFICIENT_INFO: "Vui lòng cung cấp đầy đủ thông tin",

  // Server errors
  SERVER_ERROR: "Lỗi server",
  DATABASE_ERROR: "Lỗi kết nối cơ sở dữ liệu",
} as const;

export type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];

/**
 * Role Types
 */
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Misc Constants
 */
export const TOKEN_EXPIRY = "1d"; // 1 day
export const ITEMS_PER_PAGE = 10; // For pagination
