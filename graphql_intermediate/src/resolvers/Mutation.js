import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
  deleteUser: async (parents, args, { db, prisma }, info) => {

    return prisma.mutation.deleteUser({
      where: {
        id: args.id
        }
      }, info );

  },
  updateUser: (parents, args, { prisma }, info) => {

    return prisma.mutation.updateUser({
      data: {
          ...args.data
      },
      where: {
        id: args.id
      }
    }, info);

  },
  createPost: (parent, args, { prisma }, info) => {

    return prisma.mutation.createPost({
      data: {
          ...args.data,
        author: {
            connect: {
              id: args.data.author
            }
        }
      }
    }, info);

  },
  deletePost: (parents, args, { prisma }, info) => {

    return prisma.mutation.deletePost({
      where: {
        id: args.id
      }
      }, info);

  },
  updatePost: (parents, args, { prisma }, info ) => {

    return prisma.mutation.updatePost({
      data: {
          ...args.data,
      },
      where: {
        id: args.id
      }
    }, info);

  },
  createComment: (parent, args, { db, pubsub, prisma }, info) => {

    return prisma.mutation.createComment({
      data: {
          ...args.data,
        author: {
            connect: {
              id: args.data.author
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
  deleteComment: (parent, args, { prisma }, info) => {
    return prisma.mutation.deleteComment({
      where: {
        id: args.id
      }
    }, info);
  },
  updateComment: (parents, args, { prisma }, info) => {
    return prisma.mutation.updateComment({
      data: args.data,
      where: {
        id: args.id
      }
    }, info);

  }
};

export default Mutation;
