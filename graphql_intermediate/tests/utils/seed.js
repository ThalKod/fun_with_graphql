import prisma from "../../src/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const userOne = {
  input: {
    name: "Joe",
    email: "Joe@mail.com",
    password: bcrypt.hashSync("password123")
  },
  user: undefined,
  jwt: undefined
};

export default async () => {
  // Delete tet data
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // Create userOne
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });
  userOne.jwt = jwt.sign({ id: userOne.user.id }, process.env.JWT_SECRET, { expiresIn: "7 days" });
  await prisma.mutation.createPost({
    data: {
      title: "My titiel",
      body: "",
      published: false,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });
  await prisma.mutation.createPost({
    data: {
      title: "My titiel 2",
      body: "",
      published: true,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });
}
