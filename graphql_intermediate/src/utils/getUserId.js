import jwt from "jsonwebtoken";

export default (request, requireAuth = true) => {
  const { authorization } = request.request.headers;
  if(authorization) {
    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, "Mysecret"); // Will throw an error if not verified
    return decoded.id;
  }

  if(requireAuth){
    throw new Error("Authentication required");
  }

  return null;
}
