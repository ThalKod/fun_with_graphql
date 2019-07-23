import getUserId from "../utils/getUserId";

const Subscription = {
  comment: {
    subscribe: (parents, { postID }, { prisma }, info) => {
      return prisma.subscription.comment({
        where: {
          node: {
            post: {
              id: postID
            }
          }
        }
      }, info);
    }
  },
  post: {
    subscribe: (parents, args, { prisma }, info) => {
      return prisma.subscription.post({
        where: {
          node: {
            published: true
          }
        }
      }, info)
    }
  },
  myPost: {
    subscribe: (parent, args, { prisma, req }, info ) => {
      const userId = getUserId(req);
      return prisma.subscription.post({
        where: {
          node: {
            author: {
              id: userId
            }
          }
        }
      }, info)
    }
  }
};

export default Subscription;
