import jwt from "jsonwebtoken";

export default (userId) => {
  return jwt.sign({ id: userId}, process.env.JWT_SECRET, { expiresIn: "7 days" })
};
