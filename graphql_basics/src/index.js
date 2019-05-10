import { GraphQLServer } from "graphql-yoga";

// ---------------- Graph QL types --------------------------
// Scalar types:  String, Boolean, Int, Float, ID

// Demo User Data
const users = [
  {
    id: 1,
    name: "Thal",
    email: "thal@mail.com",
  },
  {
    id: 3,
    name: "Thaasfwl",
    age: 93,
    email: "thal@mail.com",
  },
  {
    id: 2,
    name: "Jeff",
    email: "thal@mail.com",
  },
];

const posts = [
  {
    id: 1,
    title: "My Title",
    body: "That's the body",
    published: true
  },
  {
    id: 2,
    title: "My asdasd",
    body: "That's theasdadfppppdfpgppg body",
    published: false
  },
  {
    id: 3,
    title: "My Tiasdasdtle",
    body: "That's theasdsdasd body",
    published: true
  }
];

// Type definitions
const typeDefs = `
  type Query {
      posts(query: String): [Post!]!
      users(query: String): [User!]!
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
    users: (parent, args, ctx, info) => {
      if(!args.query) return users;
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      })
    },
    posts: (parents, args, ctx, info) => {
      if(!args.query) return posts;

      return posts.filter((post) => {
        return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase());
      });
    },
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

