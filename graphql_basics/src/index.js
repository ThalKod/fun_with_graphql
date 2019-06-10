import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";

import db from "./db";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import User from "./resolvers/User";
import Post from "./resolvers/Post";
import Comment from "./resolvers/Comment";

const resolvers = {
  Query,
  Mutation,
  Post,
  User,
  Comment,
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    db
  }
});

server.start(() => {
  console.log("running...");
});

