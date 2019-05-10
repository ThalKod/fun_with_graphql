import { GraphQLServer } from "graphql-yoga";

// ---------------- Graph QL types --------------------------
// Scalar types:  String, Boolean, Int, Float, ID


// Type definitions
const typeDefs = `
  type Query {
      me: User!
      post: Post!
  }
  
  type User {
      id: ID!
      name: String!
      email: String!
      age: Int
  }
  
  type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
  }
`;

// Resolvers

const resolvers = {
  Query: {
    me: () => ({
        id: "sdknndv",
        name: "Miek",
        email: "thal@mail.com"
    }),
    post: () => ({
      id: "alknadf",
      title: "The title",
      body: "The body",
      published: true
    })
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("running...");
});

