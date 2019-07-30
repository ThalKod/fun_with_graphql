import "@babel/polyfill";
import "cross-fetch/polyfill";
import ApolloBoost, { gql } from "apollo-boost";
import bcrypt from "bcryptjs";
import prisma from "../src/prisma";

const client = new ApolloBoost({
  uri: "http://localhost:8000"
});

beforeEach(async () => {
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();
  const user = await prisma.mutation.createUser({
    data: {
      name: "Joe",
      email: "Joe@mail.com",
      password: bcrypt.hashSync("password123")
    }
  });
  await prisma.mutation.createPost({
    data: {
      title: "My titiel",
      body: "",
      published: false,
      author: {
        connect: {
          id: user.id
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
          id: user.id
        }
      }
    }
  });
});

test("Should create a new user", async () => {
  const createUser = gql`
        mutation {
          createUser(
            data: {
              name: "Thal",
              email: "thal@mail.com",
              password: "password123"
            }
          ){
            token,
            user {
              id
            }
          }
        }
   `;

  const res = await client.mutate({
    mutation: createUser
  });

  const exist = await prisma.exists.User({ id: res.data.createUser.user.id})
  expect(exist).toBe(true);
});
