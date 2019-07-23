import jwt from "jsonwebtoken";

export default (userId) => {
  return jwt.sign({ id: userId}, "Mysecret", { expiresIn: "7 days" })
};
