import uuidv4 from "uuid/v4";

const Mutation = {
  createUser: async (parent, args, { prisma }, info) => {
    return prisma.mutation.createUser({
      data: args.data
    }, info);
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
