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
  }
};

export default Subscription;
