import "@babel/polyfill";
import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
import getClient from "./utils/getClient";
import seed, { userOne } from "./utils/seed";
import { getMyPosts, getPosts} from "./utils/operations"


const client = getClient();

beforeEach(seed);

test("Should retrieve only published post ", async () => {

  const res = await client.query({
    query: getPosts
  });

  expect(res.data.posts.length).toBe(1);
  expect(res.data.posts[0].published).toBe(true);
});

test("Should retrieve my posts when authenticated", async () => {
  const client = getClient(userOne.jwt);

  const { data } = await client.query({
    query: getMyPosts
  });

  expect(data.myPosts.length).toBe(2);
});
