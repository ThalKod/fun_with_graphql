import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getUserId from "../utils/getUserId";

const Mutation = {
  createUser: async (parent, args, { prisma }, info) => {
      const { data } = args;
      if(args.data.password.length < 8 ){
        throw new Error("Password must be 8 charachters at least");
      }

      const password  = await bcrypt.hash(data.password, 10);

      const user = await prisma.mutation.createUser({
        data: {
            ...data,
            password
        }
      });

      return {
        user,
        token: jwt.sign({ id: user.id}, "Mysecret")
      }
    },
  loginUser: async (parent, args, { prisma }, info ) => {
    const { data } = args;
    const user = await prisma.query.user({
      where: {
        email: data.email
      }
    });

    if(!user) throw new Error("No user record found");
    const isMatch = await bcrypt.compare(data.password, user.password);

    if(!isMatch) throw new Error("Unable to login");

    return {
      user,
      token: jwt.sign({ id: user.id }, "Mysecret")
    }
  },
  deleteUser: async (parents, args, { db, prisma, req }, info) => {
    const userId = getUserId(req);

    return prisma.mutation.deleteUser({
      where: {
        id: userId
        }
      }, info );

  },
  updateUser: (parents, args, { prisma, req }, info) => {
    const userId = getUserId(req);

    return prisma.mutation.updateUser({
      data: {
          ...args.data
      },
      where: {
        id: userId
      }
    }, info);

  },
  createPost: (parent, args, { prisma, req }, info) => {
    const userId = getUserId(req);
    return prisma.mutation.createPost({
      data: {
          ...args.data,
        author: {
            connect: {
              id: userId
            }
        }
      }
    }, info);

  },
  deletePost: async (parents, args, { prisma, req }, info) => {
    const userId = getUserId(req);
    const isPostOwner = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });

    if(!isPostOwner) throw new Error("Unable to delete post");

    return prisma.mutation.deletePost({
      where: {
        id: args.id
      }
      }, info);

  },
  updatePost: async (parents, args, { prisma, req }, info ) => {
    const userId = getUserId(req);

    const isPostOwner = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });

    const isItPublished = await prisma.exists.Post({
      id: args.id,
      published: true
    });

    if(!isPostOwner) throw new Error("Unable to update post");

    if(isItPublished){
      if(args.data.published === false){
        await prisma.mutation.deleteManyComments({
          where: {
            post: {
              id: args.id
            }
          }
        })
      }
    }

    return prisma.mutation.updatePost({
      data: {
          ...args.data,
      },
      where: {
        id: args.id
      }
    }, info);

  },
  createComment: async (parent, args, { db, prisma, req }, info) => {
    const userId  = getUserId(req);

    const existPost = await  prisma.exists.Post({
      id: args.data.post,
      published: true
    });

    console.log("Exist Post",existPost);
    if(!existPost) throw new Error("Unable to create comment");

    return prisma.mutation.createComment({
      data: {
          ...args.data,
        author: {
            connect: {
              id: userId
            }
        },
        post: {
            connect: {
              id: args.data.post
            }
        }
      }
    }, info);

  },
  deleteComment: async (parent, args, { prisma, req }, info) => {
    const userId = getUserId(req);

    const isCommentOwner = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    if(!isCommentOwner) throw new Error("Unable to delete comment");

    return prisma.mutation.deleteComment({
      where: {
        id: args.id
      }
    }, info);
  },
  updateComment: async (parents, args, { prisma, req }, info) => {
    const userId = getUserId(req);

    const isCommentOwner = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    console.log(isCommentOwner);

    if(!isCommentOwner) throw new Error("Unable to delete comment");

    return prisma.mutation.updateComment({
      data: args.data,
      where: {
        id: args.id
      }
    }, info);

  }
};

export default Mutation;
