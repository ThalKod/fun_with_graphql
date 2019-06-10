import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";

import db from "./db";

// Resolvers

const resolvers = {
  Query: {
    users: (parent, args, { db }, info) => {
      if(!args.query) return db.users;
      return db.users.filter((user) => {
        return db.users.name.toLowerCase().includes(args.query.toLowerCase());
      })
    },
    posts: (parents, args, { db }, info) => {
      if(!args.query) return db.posts;

      return db.posts.filter((post) => {
        return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    me: () => ({
        id: "sdknndv",
        name: "Miek",
        email: "thal@mail.com"
    }),
    comments: (parent, args, {db}, info) => {
      return db.comments;
    }
  },
  Mutation: {
    createUser: (parent, args, { db }, info) => {
      const emailTaken = db.users.some((user) => {
        return user.email === args.data.email;
      });

      if(emailTaken){
        throw new Error("Email Taken")
      }
      const user = {
        id: uuidv4(),
        ...args.data
      };

      db.users.push(user);
      return user;
    },
    deleteUser(parents, args, { db }, info) {
      const userIndex = db.users.findIndex((user) => {
        return user.id === args.id;
      });

      if(userIndex === -1) throw new Error("User not found");

      const deletedUsers = db.users.splice(userIndex, 1);

      db.posts = db.posts.filter((post) => {
        const match = post.author === args.id;

        if(match){
          db.comments = db.comments.filter((comment) => {
            return comment.post !== post.id;
          })
        }

          return !match;
      });
      db.comments = db.comments.filter((comment) => comment.author !== args.id);
      return deletedUsers[0];
    },
    createPost: (parent, args, { db }, info) => {
      const userExsist = db.users.some(user => user.id === args.data.author);
      if(!userExsist) throw new Error(" User not found");

      const post = {
        id: uuidv4(),
        ...args.data
      };
      db.posts.push(post);
      return post;
    },
    deletePost: (parents, args, { db }, info) => {
      const postIndex = db.posts.findIndex((post) => args.id === post.id);
      if(postIndex === -1) throw new Error("Posts not found");

      const deletedPost = db.posts.splice(postIndex, 1);

      db.comments = db.comments.filter((comment) => {
        return comment.post !== args.id;
      });

      return deletedPost[0];
    },
    createComment: (parent, args, { db }, info) => {
      const userExist = db.users.some(user => user.id === args.data.author);
      const postExist = db.posts.some(post => post.id === args.data.post && post.published === true);

      if(!userExist || !postExist) throw new Error("User or post not found");

      const comment = {
        id: uuidv4(),
        ...args.data
      };

      db.comments.push(comment);
      return comment;
    },
    deleteComment: (parent, args, { db }, info) => {
      const commentIndex = db.comments.findIndex(comment => comment.id === args.id);

      if(commentIndex === -1) throw new Error("Comment not found");

      const deletedComments = db.comments.splice(commentIndex, 1);

      db.comments = db.comments.filter((comment) => comment.id !== args.id);

      return deletedComments[0];
    },
  },

  Post: {
    author: (parent, args, { db }, info) => {
      return db.users.find((user) => {
        return user.id === parent.author
      });
    },
    comments: (parent, args, { db }, info) => {
      return db.comments.filter(comment => {
        return parent.id === comment.post
      });
    }
  },
  User: {
    posts: (parent, args, { db }, info) => {
     return db.posts.filter(post => {
        return parent.id === post.id;
      })
    },
    comments: (parent, args, { db }, info) => {
      return db.comments.filter(comment => {
        return parent.id === comment.author;
      })
    }
  },
  Comment: {
    author: (parent, args, { db }, info) => {
      return db.users.find(user => {
        return parent.author === user.id;
      })
    },
    post: (parent, args, { db }, info) => {
      return db.posts.find(post => {
        return parent.post === post.id;
      })
    }
  }
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

