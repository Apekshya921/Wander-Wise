import jwt from "jsonwebtoken";

export const generateAccessToken = async (
  data,
  expiresIn = process.env.JWT_EXPIRE_IN
) => {
  const token = await jwt.sign(
    data,
    process.env.JWT_SECRET_KEY,
    { expiresIn }
  );

  return token;
};

export const verifyAccessToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  return decoded?.userId ?? decoded?.tripId;
}; 
