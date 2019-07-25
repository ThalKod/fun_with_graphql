import "@babel/polyfill/noConflict";
import { GraphQLServer, PubSub } from "graphql-yoga";

import db from "./db";
import { resolvers, fragmentReplacements } from "./resolvers";
import prisma from  "./prisma";

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "src/schema.graphql",
  resolvers,
  context: (req) => {
    return {
      db,
      pubsub,
      prisma,
      req
    }
  },
  fragmentReplacements
});

const options = {
  port: process.env.PORT || 8000,
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: '/playground',
};

server.start(options, (err) => {
  console.log(`Running on localhost:${err.port}${err.playground}...`);
});

