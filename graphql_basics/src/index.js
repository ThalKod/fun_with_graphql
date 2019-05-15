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
    published: true,
    author: 1
  },
  {
    id: 2,
    title: "My asdasd",
    body: "That's theasdadfppppdfpgppg body",
    published: false,
    author: 1
  },
  {
    id: 3,
    title: "My Tiasdasdtle",
    body: "That's theasdsdasd body",
    published: true,
    author: 2
  }
];

const comments = [
  {
    id: 1,
    text: "my First comment"
  },
  {
    id: 2,
    text: "my second comment"
  }
];

// Type definitions
const typeDefs = `
  type Query {
      posts(query: String): [Post!]!
      users(query: String): [User!]!
      me: User!
      post: Post!
      comment: [Comment!]!
  }
  
  type User {
      id: ID!
      name: String!
      email: String! 
      age: Int
      posts: [Post!]!
  }
  
  type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
      author: User!
  }
  
  type Comment {
    id: ID!
    text: String!
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
    }),
    comment: (parent, args, ctx, info) => {
      return comments;
    }
  },
  Post: {
    author: (parent, args, ctx, info) => {
      return users.find((user) => {
        return user.id === parent.author
      });
    }
  },
  User: {
    posts: (parent, args, ctx, info) => {
     return posts.filter(post => {
        return parent.id === post.id;
      })
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("running...");
});

