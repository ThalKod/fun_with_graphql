import "@babel/polyfill/noConflict";
import server from "./server";

const options = {
  port: process.env.PORT || 8000,
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: '/playground',
};

server.start(options, (err) => {
  console.log(`Running on localhost:${err.port}${err.playground}...`);
});

