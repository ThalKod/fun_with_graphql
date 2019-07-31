import "@babel/polyfill";
import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
import seed, { userOne } from "./utils/seed";
import prisma from "../src/prisma";
import getClient from "./utils/getClient";
import {
  createUser,
    getProfile,
    login,
    getUsers
} from "./utils/operations"

const client = getClient();

beforeEach(seed);

test("Should create a new user", async () => {

  const variables = {
    data: {
      name: "Thal",
      email: "thal@mail.com",
      password: "password123"
    }
  };

  const res = await client.mutate({
    mutation: createUser,
    variables
  });

  const exist = await prisma.exists.User({ id: res.data.createUser.user.id})
  expect(exist).toBe(true);
});

test("Should retrieve public author profiles", async () => {

  const res = await client.query({
    query: getUsers
  });

  expect(res.data.users.length).toBe(1);
  expect(res.data.users[0].email).toBe(null);
  expect(res.data.users[0].name).toBe("Joe");
});

test("Should not login with bad credentials ", async () => {

  const variables = {
    data: {
      email:"bad@mail.com",
      password: "aoaoao"
    }
  };


  await expect(
      client.mutate({ mutation: login, variables })
  ).rejects.toThrow()
});

test("Should not signup with a password less than 8 characters", async () => {
  const variables = {
    data: {
      name: "Mike",
      email: "mike@mail.com",
      password: "pass"
    }
  };

  await expect(
      client.mutate({mutation: createUser, variables})
  ).rejects.toThrow();
});

test("Should fetch user profile", async () => {
  const client = getClient(userOne.jwt);

  const { data }  = await client.query({query: getProfile})
  expect(data.me.id).toBe(userOne.user.id);
  expect(data.me.name).toBe(userOne.user.name);
  expect(data.me.email).toBe(userOne.user.email);
});
