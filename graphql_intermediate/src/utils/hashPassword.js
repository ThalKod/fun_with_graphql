import bcrypt from "bcryptjs";

const hashPassword =( password) => {
  if(password.length < 8 ){
    throw new Error("Password must be 8 charachters at least");
  }

  return bcrypt.hash(data.password, 10);
};

export default hashPassword;
