import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  });
};

const generateRefreshToken = () => {
  return uuidv4();
};

const getRefreshTokenExpirationDate = () => {
  const expiresAt = new Date();
  const expirationDays = Number(process.env.REFRESH_TOKEN_EXPIRATION_DAYS ?? 7);

  expiresAt.setDate(expiresAt.getDate() + expirationDays);

  return expiresAt;
};

export {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpirationDate,
};