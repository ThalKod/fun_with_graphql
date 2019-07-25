import jwt from "jsonwebtoken";

export default (request, requireAuth = true) => {
  const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization;

  if(header) {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Will throw an error if not verified
    return decoded.id;
  }

  if(requireAuth){
    throw new Error("Authentication required");
  }

  return null;
}
