import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";

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
    text: "my First comment",
    author: 1,
    post: 1
  },
  {
    id: 2,
    text: "my second comment",
    author: 2,
    post: 1
  }
];

// Type definitions
const typeDefs = `
  type Query {
      posts(query: String): [Post!]!
      users(query: String): [User!]!
      me: User!
      comments: [Comment!]!
  }
  
  type Mutation {
      createUser(name: String!, email: String!, age: Int!): User!
      createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
  }
  
  type User {
      id: ID!
      name: String!
      email: String! 
      age: Int
      posts: [Post!]!
      comments: [Comment!]!
  }
  
  type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
      author: User!
      comments: [Comment!]!
  }
  
  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    comments: (parent, args, ctx, info) => {
      return comments;
    }
  },
  Mutation: {
    createUser: (parent, args, ctx, info) => {
      const emailTaken = users.some((user) => {
        return user.email === args.email;
      });

      if(emailTaken){
        throw new Error("Email Taken")
      }
      const user = {
        id: uuidv4(),
        ...args
      };

      users.push(user);
      return user;
    },
    createPost: (parent, args, ctx, info) => {
      const userExsist = users.some(user => user.id === args.author);
      if(!userExsist) throw new Error(" User not found");

      const post = {
        id: uuidv4(),
        ...args
      };
      posts.push(post);
      return post;
    }
  },
  Post: {
    author: (parent, args, ctx, info) => {
      return users.find((user) => {
        return user.id === parent.author
      });
    },
    comments: (parent, args, ctx, info) => {
      return comments.filter(comment => {
        return parent.id === comment.post
      });
    }
  },
  User: {
    posts: (parent, args, ctx, info) => {
     return posts.filter(post => {
        return parent.id === post.id;
      })
    },
    comments: (parent, args, ctx, info) => {
      return comments.filter(comment => {
        return parent.id === comment.author;
      })
    }
  },
  Comment: {
    author: (parent, args, ctx, info) => {
      return users.find(user => {
        return parent.author === user.id;
      })
    },
    post: (parent, args, ctx, info) => {
      return posts.find(post => {
        return parent.post === post.id;
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

